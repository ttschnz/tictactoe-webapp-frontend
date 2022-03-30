import classNames from "classnames";
import React, { SyntheticEvent } from "react";
import WebSocketConnection, { api } from "../api/apiService";
import { getGameKey } from "../api/credentials";
import { gameIdToHex, parseMoves } from "../utils/gameUtils";

import {
    GameMetaData,
    PositionIndex,
    PostGameInfo,
    Move,
    SocketResponse,
} from "../utils/types";
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
class GameField extends React.Component<
    {
        gameField: PostGameInfo["gameField"] | undefined[];
        sizeValue: number;
        sizeUnit: "vh" | "vw" | "%" | "px";
        gameId: number;
        useNewSocket: boolean;
        editable: boolean;
    },
    {
        gameField: PostGameInfo["gameField"] | undefined[];
        players: GameMetaData["players"];
    }
> {
    socket?: WebSocketConnection;
    socketRefresh?: NodeJS.Timer;
    constructor(props: any) {
        super(props);
        this.state = {
            gameField: this.props.gameField,
            players: {},
        };
        // bind the makeMove function to the component
        this.makeMove = this.makeMove.bind(this);
    }
    async componentDidMount() {
        // subscribe to the game via websocket as soon as the component is mounted
        this.socket = new WebSocketConnection(this.props.useNewSocket);
        this.socket.send(
            "subscribeGame",
            {
                gameId: this.props.gameId,
            },
            false,
            undefined,
            (response: SocketResponse) => {
                console.log("got response from server", response);

                // if the response is a game update
                if (response.success && response.action === "broadcast") {
                    const gameData: GameMetaData = response.data;
                    // parse the moves
                    console.log("got new game field", response.data);
                    // set the new game field
                    this.setState({
                        gameField: parseMoves(gameData.moves, gameData.players),
                    });
                }
            }
        );

        // get the gameField from the API
        let response = await api(`/viewGame`, {
            gameId: gameIdToHex(this.props.gameId),
        });
        // if the response is successful, update the gameField
        if (response.success) {
            // get the meta data of the game
            const gameMetaData = {
                players: response.data.players,
                gameState: response.data.gameState,
                moves: response.data.moves,
            } as GameMetaData;
            // get the moves of the game
            const moves = response.data.moves as Move[];
            // evaluate the game
            let gameField = parseMoves(moves, gameMetaData.players);
            // update the gameField
            console.log("updating gameField", gameField);
            this.setState({ gameField, players: gameMetaData.players });
        }
    }
    componentWillUnmount(): void {
        // unsubscribe from the game when the component is unmounted
        this.socket?.send("unsubscribeGame", {
            gameId: this.props.gameId,
        });
        // clear the timer
        console.log("clearing timer for socket refresh");
        if (this.socketRefresh) clearInterval(this.socketRefresh);
    }
    render(): React.ReactNode {
        //
        console.log("rendering game field", this.state.gameField);
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
    makeMove(index: PositionIndex): Promise<boolean> {
        return new Promise((resolve, _reject) => {
            if (this.props.editable) {
                console.log("making move", index);
                // send the move to the server via the websocket
                this.socket?.send(
                    "makeMove",
                    {
                        movePosition: index,
                        gameId: this.props.gameId,
                    },
                    true,
                    getGameKey(this.props.gameId),
                    (response) => {
                        resolve(response.success);
                    }
                );
            } else {
                resolve(false);
            }
        });
    }
    getGameTiles(): JSX.Element[] {
        // map the game field to the game tiles and return them
        return this.state.gameField.map((value, index) => (
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
