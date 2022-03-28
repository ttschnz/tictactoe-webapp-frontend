import React from "react";
import WebSocketConnection from "../api/apiService";
import { gameIdToHex, parseMoves } from "../utils/gameUtils";
import { PositionIndex, PostGameInfo, SocketResponse } from "../utils/types";
import FlexContainer from "./FlexContainer";
import "./GameField.css";
const occupierMap = { "-1": "o", "1": "x", "0": "none", undefined: "loading" };
class GameTile extends React.Component<{
    value?: PostGameInfo["gameField"][0];
    index: PositionIndex;
    makeMove: Function;
}> {
    render(): JSX.Element {
        return (
            <div
                className="GameTile"
                data-occupied-by={
                    occupierMap[
                        String(this.props.value) as
                            | "0"
                            | "-1"
                            | "1"
                            | "undefined"
                    ]
                }
                data-value={this.props.value}
                data-index={this.props.index}
            ></div>
        );
    }
}

class GameField extends React.Component<{
    gameField: PostGameInfo["gameField"] | undefined[];
    sizeValue: number;
    sizeUnit: "vh" | "vw" | "%" | "px";
    gameId: number;
    useNewSocket: boolean;
}> {
    socket?: WebSocketConnection;
    socketRefresh?: NodeJS.Timer;
    componentDidMount(): void {
        this.socket = new WebSocketConnection(this.props.useNewSocket);
        this.socket
            .send(
                "subscribeGame",
                {
                    gameId: gameIdToHex(this.props.gameId),
                },
                false,
                false
            )
            .then((value) => {
                let lastValue: SocketResponse[];
                this.socketRefresh = setInterval(() => {
                    if (lastValue !== value) {
                        console.log("got response from server", value);
                        // TODO: check if the moves are really directly in the data of the socket
                        let newResponse = (value as SocketResponse[])[
                            (value as SocketResponse[]).length - 1
                        ];
                        if (
                            newResponse.success &&
                            Array.isArray(newResponse.data)
                        ) {
                            console.log("got new game field", newResponse.data);
                            let { data } = newResponse;
                            this.setState({
                                gameField: parseMoves(data),
                            });
                        }
                        console.log(value);
                        lastValue = value as SocketResponse[];
                    } else {
                    }
                }, 100);
            });
    }
    componentWillUnmount(): void {
        this.socket?.send("unsubscribeGame", {
            gameId: gameIdToHex(this.props.gameId),
        });
        if (this.socketRefresh) clearInterval(this.socketRefresh);
    }
    render(): React.ReactNode {
        console.log("rendering game field", this.props.gameField);
        return (
            <FlexContainer
                direction="row"
                className="GameField"
                style={this.getStyle()}
            >
                {this.getGameTiles()}
            </FlexContainer>
        );
    }
    async makeMove(index: PositionIndex): Promise<boolean> {
        return (
            (await this.socket?.send(
                "makeMove",
                { movePosition: index, gameId: this.props.gameId },
                true
            )) as SocketResponse
        ).success;
    }
    getGameTiles(): JSX.Element[] {
        return this.props.gameField.map((value, index) => (
            <GameTile
                value={value}
                key={index}
                index={index as PositionIndex}
                makeMove={this.makeMove}
            />
        ));
    }
    getStyle(): React.CSSProperties {
        let styles: { [key: string]: string } = {};
        styles["--sizeValue"] = String(this.props.sizeValue);
        styles["--sizeUnit"] = `1${this.props.sizeUnit}`;
        styles["gap"] = `${this.props.sizeValue / 100}${this.props.sizeUnit}`;
        return styles as React.CSSProperties;
    }
}
export default GameField;
