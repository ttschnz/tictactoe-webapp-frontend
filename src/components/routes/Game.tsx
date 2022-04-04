import classNames from "classnames";
import React from "react";
import { useParams } from "react-router-dom";
import { getCredentials, getGameKey } from "../../api/credentials";
import {
    gameIdFromHex,
    gameIdToHex,
    gameStorage,
    loadGame,
} from "../../utils/gameUtils";
import { PostGameInfo, Players } from "../../utils/types";
import FlexContainer from "../FlexContainer";
import GameField from "../GameField";
import Heading from "../Heading";
import Tile from "../Tile";
import UserSpan from "../UserSpan";
import Error404 from "./Error404";
import "./Game.css";
import { getGameState } from "./GameOverview";
import { Subscription } from "rxjs";
import { gameChange } from "../../utils/subjects";
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
 * A component that renders the stats of a fullscreen game.
 * @component
 * @hideconstructor
 */
class GameStats extends React.Component<
    { gameId: PostGameInfo["gameId"] },
    { gameInfo: PostGameInfo }
> {
    subscriptions: { [key: string]: Subscription } = {};
    constructor(props: any) {
        super(props);
        // initialize the players and gameState with an empty values
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

    componentDidMount() {
        // subscribe to the gameChange subject
        this.subscriptions.gameChange = gameChange.subscribe({
            next: (gameInfo) => {
                console.log(`gameChange @GameStats :`, gameInfo);
                this.setState({ gameInfo });
            },
        });
        // ask for an update on the game if the game cannot be found in the game storage
        // the update will come over the gameChange subject, therefore we don't need to wait for it
        if (!gameStorage.loadGame(this.props.gameId))
            loadGame(this.props.gameId);
    }
    componentWillUnmount() {
        // unsubscribe from the gameChange subject
        this.subscriptions.gameChange.unsubscribe();
    }
    getOwnRole(): "attacker" | "defender" | false {
        const attacker = this.state.gameInfo.attacker;
        const defender = this.state.gameInfo.defender;
        // if the attacker and defener are set in the state, check if the user has access to the game
        if (
            attacker !== undefined &&
            defender !== undefined &&
            hasAccessToGame(this.props.gameId, attacker, defender)
        ) {
            // the user takes part in the game, now we need to figure out if he is the attacker or the defender
            const credentials = getCredentials();
            const username = credentials ? credentials.username : null;
            return attacker === username
                ? "attacker"
                : defender === username
                ? "defender"
                : false;
        }
        console.log(
            "has no access to game",
            this.props.gameId,
            attacker,
            defender
        );
        return false;
    }

    render(): React.ReactNode {
        console.log("own role:", this.getOwnRole());
        return (
            <Tile className="GameStats">
                {/* show the game id */}
                <Heading level={1}>#{gameIdToHex(this.props.gameId)}</Heading>
                {/* display the current game state (ongoing, won, etc.) */}
                <span>{getGameState(this.state.gameInfo)}</span>
                {/* show who is attacking */}
                <FlexContainer
                    direction="row"
                    key="gameAttacker"
                    verticalCenter
                    className={classNames(
                        "GameStats-Player",
                        this.getOwnRole() === "attacker" &&
                            "GameStats-Player-OwnRole"
                    )}
                >
                    <Heading level={3}>Attacker:</Heading>
                    <UserSpan username={this.state.gameInfo.attacker} />
                </FlexContainer>
                {/* show who is defending */}
                <FlexContainer
                    direction="row"
                    key="gameDefender"
                    verticalCenter
                    className={classNames(
                        "GameStats-Player",
                        this.getOwnRole() === "defender" &&
                            "GameStats-Player-OwnRole"
                    )}
                >
                    <Heading level={3}>Defender:</Heading>
                    <UserSpan username={this.state.gameInfo.defender} />
                </FlexContainer>
            </Tile>
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

/**
 * Pass the gameId from the matched URL to the GameStats component.
 */
function _GameStats() {
    const { gameId } = useParams();
    if (gameId) return <GameStats gameId={gameIdFromHex(gameId)} />;
    else return <Error404 />;
}

/**
 * A funciton that figures out whether the user has access to a game, either by being the attacker or the defender or by having the gameKey.
 * @param gameId the gameId of the game in question
 * @param attacker the username of the attacker
 * @param defender the username of the defender
 */
export function hasAccessToGame(
    gameId: number,
    attacker: Players["attacker"],
    defender: Players["defender"]
) {
    const credentials = getCredentials();
    // if the user is the attacker or the defender, he has access to the game
    if (
        credentials &&
        (credentials.username === attacker || credentials.username === defender)
    ) {
        return true;
        // if the user has the gameKey, he has access to the game
    } else if (getGameKey(gameId)) {
        return true;
    } else {
        return false;
    }
}

_Game.GameStats = _GameStats;
export default _Game;
