import React from "react";
import { useParams } from "react-router-dom";
import {
    gameIdFromHex,
    gameStorage,
    loadGame,
    hasAccessToGame,
} from "../../utils/gameUtils";
import { PostGameInfo } from "../../utils/types";
import GameField from "../GameField";
import Error404 from "./Error404";
import "./Game.css";
import { Subscription } from "rxjs";
import { gameChange } from "../../utils/subjects";
import jsUtils from "../../utils/jsUtils";
/**
 * A component that renders the game of a fullscreen game.
 * @component
 * @hideconstructor
 */
class Game extends React.Component<
    { gameId: PostGameInfo["gameId"] },
    {
        gameInfo: PostGameInfo;
    }
> {
    subscriptions: { [key: string]: Subscription } = {};
    constructor(props: any) {
        super(props);
        // initialize the gameField with an empty array
        console.log("initializing gameField");
        this.state = {
            gameInfo: {
                attacker: undefined,
                defender: undefined,
                gameField: [],
                gameId: this.props.gameId,
                isDraw: undefined,
                isFinished: undefined,
                winner: false,
            },
        };
    }
    async componentDidMount() {
        // subscribe to the gameChange subject
        this.subscriptions.gameChange = gameChange.subscribe({
            next: (gameInfo) => {
                console.log(`gameChange @Game:`, gameInfo);
                this.setState({ gameInfo });
            },
        });
        // ask for an update on the game if the game cannot be found in the game storage
        // the update will come over the gameChange subject, therefore we don't need to wait for it
        if (!gameStorage.loadGame(this.props.gameId))
            loadGame(this.props.gameId);
        jsUtils.changeTitle(`Game #${this.props.gameId}`);
    }
    componentWillUnmount() {
        // unsubscribe from the gameChange subject
        this.subscriptions.gameChange.unsubscribe();
    }
    render(): React.ReactNode {
        return (
            <GameField
                players={{
                    attacker: this.state.gameInfo.attacker,
                    defender: this.state.gameInfo.defender,
                }}
                gameId={this.props.gameId}
                sizeUnit="px"
                sizeValue={500}
                editable={hasAccessToGame(
                    this.props.gameId,
                    this.state.gameInfo.attacker,
                    this.state.gameInfo.defender
                )}
            ></GameField>
        );
    }
}

/**
 * Pass the gameId from the matched URL to the Game component.
 */
function _Game() {
    const { gameId } = useParams();
    if (gameId) return <Game gameId={gameIdFromHex(gameId)} />;
    else return <Error404 />;
}

export default _Game;
