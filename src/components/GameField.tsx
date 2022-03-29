import classNames from "classnames";
import React, { SyntheticEvent } from "react";
import WebSocketConnection from "../api/apiService";
import { gameIdToHex, parseMoves } from "../utils/gameUtils";
import { PositionIndex, PostGameInfo, SocketResponse } from "../utils/types";
import FlexContainer from "./FlexContainer";
import "./GameField.css";
const occupierMap = { "-1": "o", "1": "x", "0": "none", undefined: "loading" };
/**
 * A game tile component that can be used to display a part of the game field.
 * @component
 * @hideconstructor
 */
class GameTile extends React.Component<{
    // the occupier of the tile
    value?: PostGameInfo["gameField"][0];
    // the index of the tile
    index: PositionIndex;
    editable: boolean;
    makeMove: Function;
}> {
    constructor(props: any) {
        super(props);
        this.makeMove = this.makeMove.bind(this);
    }
    render(): JSX.Element {
        return (
            <div
                className={classNames(
                    "GameTile",
                    this.props.editable && "GameTile-Editable"
                )}
                // set the occupier of the tile to the dataset
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
                // set the index of the tile to the dataset
                data-index={this.props.index}
                onClick={this.makeMove}
            ></div>
        );
    }
    makeMove(e: SyntheticEvent) {
        console.log(this.props.index);
        this.props.makeMove(this.props.index);
    }
}

/**
 * A game field component that can be used to display the game field. Uses the GameTile component to display the tiles.
 * @component
 * @hideconstructor
 */
class GameField extends React.Component<{
    gameField: PostGameInfo["gameField"] | undefined[];
    sizeValue: number;
    sizeUnit: "vh" | "vw" | "%" | "px";
    gameId: number;
    useNewSocket: boolean;
    editable: boolean;
}> {
    socket?: WebSocketConnection;
    socketRefresh?: NodeJS.Timer;
    constructor(props: any) {
        super(props);
        // bind the makeMove function to the component
        this.makeMove = this.makeMove.bind(this);
    }
    componentDidMount(): void {
        // subscribe to the game via websocket as soon as the component is mounted
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
                // the value will be updated as more data is received, therefore we need to update the state when the data is received
                let lastValue: SocketResponse[];
                // set a timer to update the state every half second
                this.socketRefresh = setInterval(() => {
                    // if the value has changed since the last update
                    if (lastValue !== value) {
                        console.log("got response from server", value);
                        // TODO: check if the moves are really directly in the data of the socket
                        let newResponse = (value as SocketResponse[])[
                            (value as SocketResponse[]).length - 1
                        ];
                        // if the response is a game update
                        if (
                            newResponse.success &&
                            Array.isArray(newResponse.data)
                        ) {
                            // parse the moves
                            console.log("got new game field", newResponse.data);
                            let { data } = newResponse;
                            // set the new game field
                            this.setState({
                                gameField: parseMoves(data),
                            });
                        }
                        console.log(value);
                        lastValue = value as SocketResponse[];
                    } else {
                    }
                }, 500);
            });
    }
    componentWillUnmount(): void {
        // unsubscribe from the game when the component is unmounted
        this.socket?.send("unsubscribeGame", {
            gameId: gameIdToHex(this.props.gameId),
        });
        // clear the timer
        if (this.socketRefresh) clearInterval(this.socketRefresh);
    }
    render(): React.ReactNode {
        //
        console.log("rendering game field", this.props.gameField);
        return (
            <FlexContainer
                direction="row"
                className="GameField"
                style={this.getStyle()}
            >
                {/* render the game tiles */}
                {this.getGameTiles()}
            </FlexContainer>
        );
    }
    // make a move on the game field and send it to the server
    async makeMove(index: PositionIndex): Promise<boolean> {
        console.log(this.props.editable, index);
        if (this.props.editable) {
            console.log("making move", index);
            return (
                // send the move to the server via the websocket
                (
                    (await this.socket?.send(
                        "makeMove",
                        { movePosition: index, gameId: this.props.gameId },
                        true
                    )) as SocketResponse
                ).success
            );
        } else return false;
    }
    getGameTiles(): JSX.Element[] {
        // map the game field to the game tiles and return them
        return this.props.gameField.map((value, index) => (
            <GameTile
                value={value}
                key={index}
                // set the index of the tile to the index of the game field
                index={index as PositionIndex}
                makeMove={this.makeMove}
                editable={this.props.editable}
            />
        ));
    }
    getStyle(): React.CSSProperties {
        // return the style of the game field
        let styles: { [key: string]: string } = {};
        // set the size of the game field
        styles["--sizeValue"] = String(this.props.sizeValue);
        // set the unit of the size
        styles["--sizeUnit"] = `1${this.props.sizeUnit}`;
        // set the gap between the tiles to 1% of the size
        styles["gap"] = `${this.props.sizeValue / 100}${this.props.sizeUnit}`;
        return styles as React.CSSProperties;
    }
}
export default GameField;
