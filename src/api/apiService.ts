import config from "../utils/config";
import { errorSubject } from "../utils/subjects";
import {
    JSONResponse,
    SocketResponse,
    listener,
    messageListener,
} from "../utils/types";
import { getCredentials } from "./credentials";
import forge from "node-forge";
export function api(
    target: string,
    data = {},
    sendToken = false
): Promise<{ success: boolean; error?: any; data?: any }> {
    return new Promise((resolve, _reject) => {
        let credentials = getCredentials();
        // if config.useSameServer is true, the api server is the same as the frontend server
        let serverLocation = config.server.useSameServer
            ? window.location
            : config.server;
        fetch(
            `${serverLocation.protocol}//${serverLocation.hostname}:${serverLocation.port}${config.server.prefix}${target}`,
            {
                method: "post",
                body: new URLSearchParams(Object.entries(data)).toString(),
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded; charset=UTF-8",
                    ...(sendToken && credentials
                        ? {
                              Authorisation: `Bearer ${credentials.token}`,
                          }
                        : {}),
                },
            }
        )
            .then(async (response) => {
                if (!response.ok) {
                    resolve({
                        success: false,
                        error: response.statusText,
                    });
                    errorSubject.next("Failed to call api");
                }
                let responseJson = await response.json();
                // resolve with response if it is is parseable, else resolve with empty object
                resolve(
                    ([null, undefined, NaN].indexOf(responseJson) !== -1
                        ? {
                              success: false,
                          }
                        : responseJson) as JSONResponse
                );
            })
            .catch((reason) => {
                resolve({
                    success: false,
                    error: reason,
                });
                errorSubject.next("Could not connect to server");
            });
    });
}
export default class WebSocketConnection {
    socket?: WebSocket;
    open: boolean = false;
    openListeners: listener[] = [];
    messageListeners: messageListener = {};
    constructor(forceNew: boolean) {
        if (forceNew) this.createSocket();
        else if (currentSocket === undefined) {
            currentSocket = this;
            this.createSocket();
        } else {
            console.log("socket exists already");
            return currentSocket;
        }
    }

    createSocket() {
        console.log("creating socket");

        let serverLocation = config.server.useSameServer
            ? window.location
            : config.server;

        this.socket = new WebSocket(
            `${config.server.socketProtocol}${serverLocation.hostname}${config.server.socketPrefix}`
        );
        this.socket.onopen = () => {
            let pair: listener | undefined;
            while ((pair = this.openListeners.pop())) {
                this.open = true;
                pair.resolve(true);
            }
        };

        this.socket.onclose = () => {
            console.log("socket closed");
            let pair: listener | undefined;
            while ((pair = this.openListeners.pop())) {
                this.open = true;
                pair.resolve(true);
            }
            setTimeout(() => {
                this.createSocket();
            }, 200);
            this.open = false;
        };

        this.socket.onmessage = (ev: MessageEvent) => {
            let message: SocketResponse = JSON.parse(ev.data);
            let pair = this.messageListeners[message.msgId];
            if (pair) {
                pair.resolve(message);
            }
        };
    }

    get socketProtocol(): String {
        if (document.location.protocol === "https:") return "wss://";
        else return "ws://";
    }

    async awaitOpen(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.socket && this.socket.readyState === this.socket.OPEN)
                resolve(true);
            else
                this.openListeners.push({
                    resolve,
                    reject,
                });
        });
    }
    /**
     * awaits a response for a message
     * @param action
     * @returns
     */
    async awaitMessage(msgId: string): Promise<SocketResponse> {
        return new Promise((resolve, reject) => {
            this.messageListeners[msgId] = {
                resolve,
                reject,
            };
        });
    }

    /**
     *
     * @param action action to preform on the server
     * @param args arguments required for the action
     * @returns the response from the server
     */
    async send(
        action: string,
        args?: any,
        sendCredentials: boolean = false,
        gameKey?: string,
        callback: (response: SocketResponse) => void = () => {}
    ): Promise<void> {
        let msgId = forge.util.bytesToHex(forge.random.getBytesSync(36));
        let credentials = getCredentials();
        if (credentials && sendCredentials) args.token = credentials.token;
        if (gameKey) args.gameKey = gameKey;
        await this.awaitOpen();
        if (this.socket)
            this.socket.send(
                JSON.stringify({
                    action,
                    args,
                    msgId,
                })
            );

        while (this.open) {
            callback(await this.awaitMessage(msgId));
        }
    }

    /**
     * Ping the server over WebSocket and find out how fast the connection is
     * @returns ping in ms
     */
    async ping(): Promise<number> {
        let startTime = new Date().getTime();
        await this.send("ping");
        let endTime = new Date().getTime();
        return endTime - startTime;
    }
}

let currentSocket: WebSocketConnection;
