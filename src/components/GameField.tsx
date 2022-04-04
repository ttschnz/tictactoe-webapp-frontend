import classNames from "classnames";
import React from "react";
import { Subscription } from "rxjs";

import {
    loadGame,
    makeMove,
    subscribeGame,
    unsubscribeGame,
} from "../utils/gameUtils";
import { gameChange } from "../utils/subjects";

import { PositionIndex, PostGameInfo, Players } from "../utils/types";
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
    error?: boolean;
}> {
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
                onClick={() => {
                    this.props.makeMove(this.props.index);
                }}
            ></div>
        );
    }
}

/**
 * A game field component that can be used to display the game field. Uses the GameTile component to display the tiles.
 * @component
 * @hideconstructor
 */
class GameField extends React.Component<
    {
        gameField?: PostGameInfo["gameField"] | undefined[];
        players: Players;
        sizeValue: number;
        sizeUnit: "vh" | "vw" | "%" | "px";
        gameId: number;
        editable: boolean;
    },
    {
        gameField: PostGameInfo["gameField"] | undefined[];
        players: Players;
        errrors: boolean[];
    }
> {
    subscriptions: { [key: string]: Subscription } = {};
    constructor(props: any) {
        super(props);
        this.state = {
            gameField: this.props.gameField ?? new Array(9).fill(undefined),
            players: { attacker: undefined, defender: undefined },
            errrors: new Array(9).fill(false),
        };
        // bind the makeMove function to the component
        this.makeMove = this.makeMove.bind(this);
    }
    async componentDidMount() {
        // subscribe to the game
        subscribeGame(this.props.gameId);
        // ask to load the game if it was not served by the caller
        if (this.props.gameField === undefined) loadGame(this.props.gameId);
        // listen for game updates
        this.subscriptions.gameUpdate = gameChange.subscribe({
            next: (gameInfo) => {
                if (gameInfo.gameId === this.props.gameId) {
                    console.log(`gameChange:`, gameInfo);
                    let { attacker, defender, gameField } = gameInfo;
                    this.setState({
                        gameField: gameField,
                        players: { attacker, defender },
                    });
                }
            },
        });
    }
    componentWillUnmount(): void {
        // unsubscribe from the game when the component is unmounted
        unsubscribeGame(this.props.gameId);
    }
    render(): React.ReactNode {
        // console.log("rendering game field", this.props.gameField);
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
        console.log("making move", index);
        if (this.props.editable) {
            // send the move to the server via the websocket
            let success = await makeMove(this.props.gameId, index);
            if (!success) {
                console.log("failed to make move");
                // set the error flag for the tile
                this.error(index);
            }
            return success;
        } else {
            console.log("not editable");
            return false;
        }
    }
    error(index: number) {
        console.log("error on tile", index);
        // set the error flag for the tile
        this.setState((currentState) => {
            // copy the current states error array
            let newErrors = currentState.errrors.slice();
            // set the error flag for the tile
            newErrors[index] = true;
            // return the new error array
            return {
                errrors: newErrors,
            };
        });
        // set timeout to reset the error flag
        setTimeout(() => {
            this.setState((currentState) => {
                // copy the current states error array
                let newErrors = currentState.errrors.slice();
                // set the error flag for the tile
                newErrors[index] = false;
                // return the new error array
                return {
                    errrors: newErrors,
                };
            });
        }, 1000);
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
                error={this.state.errrors[index]}
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
