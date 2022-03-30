import classNames from "classnames";
import React from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/apiService";
import { getCredentials, getGameKey } from "../../api/credentials";
import { gameIdFromHex, gameIdToHex, parseMoves } from "../../utils/gameUtils";
import { GameMetaData, Move, PostGameInfo } from "../../utils/types";
import FlexContainer from "../FlexContainer";
import GameField from "../GameField";
import Heading from "../Heading";
import Tile from "../Tile";
import UserSpan from "../UserSpan";
import Error404 from "./Error404";
import "./Game.css";
import { getGameState } from "./GameOverview";

/**
 * A component that renders the game of a fullscreen game.
 * @component
 * @hideconstructor
 */
class Game extends React.Component<
    { gameId: PostGameInfo["gameId"] },
    {
        gameField: PostGameInfo["gameField"] | undefined[];
        players: GameMetaData["players"];
    }
> {
    constructor(props: any) {
        super(props);
        // initialize the gameField with an empty array
        console.log("initializing gameField");
        this.state = { gameField: Array(9).fill(undefined), players: {} };
    }
    // async componentDidMount() {
    //     // get the gameField from the API
    //     let response = await api(`/viewGame`, {
    //         gameId: gameIdToHex(this.props.gameId),
    //     });
    //     // if the response is successful, update the gameField
    //     if (response.success) {
    //         // get the meta data of the game
    //         const gameMetaData = {
    //             players: response.data.players,
    //             gameState: response.data.gameState,
    //             moves: response.data.moves,
    //         } as GameMetaData;
    //         // get the moves of the game
    //         const moves = response.data.moves as Move[];
    //         // evaluate the game
    //         let gameField = parseMoves(moves, gameMetaData.players);
    //         // update the gameField
    //         console.log("updating gameField", gameField);
    //         this.setState({ gameField, players: gameMetaData.players });
    //     }
    // }
    render(): React.ReactNode {
        console.log("rendering game with gameField", this.state.gameField);
        return (
            <GameField
                gameField={this.state.gameField}
                gameId={this.props.gameId}
                sizeUnit="px"
                sizeValue={500}
                useNewSocket={true}
                editable={hasAccessToGame(
                    this.props.gameId,
                    this.state.players.attacker,
                    this.state.players.defender
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
    { players: GameMetaData["players"]; gameState: GameMetaData["gameState"] }
> {
    constructor(props: any) {
        super(props);
        // initialize the players and gameState with an empty values
        this.state = {
            players: { attacker: undefined, defender: undefined },
            gameState: {
                finished: undefined,
                winner: undefined,
                isDraw: undefined,
            },
        };
    }

    async componentDidMount() {
        // get the gameMetaData from the API
        let response = await api(`/viewGame`, {
            gameId: gameIdToHex(this.props.gameId),
        });
        // if the response is successful, update the players and gameState
        if (response.success) {
            // get the meta data of the game
            const gameMetaData = {
                players: response.data.players,
                gameState: response.data.gameState,
                moves: response.data.moves,
            } as GameMetaData;
            // update the players and gameState
            this.setState({
                players: gameMetaData.players,
                gameState: gameMetaData.gameState,
            });
        }
    }
    getOwnRole(): "attacker" | "defender" | false {
        const attacker = this.state.players.attacker;
        const defender = this.state.players.defender;
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
                <span>{getGameState(this.state.gameState)}</span>
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
                    <UserSpan username={this.state.players.attacker} />
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
                    <UserSpan username={this.state.players.defender} />
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
    attacker: GameMetaData["players"]["attacker"],
    defender: GameMetaData["players"]["defender"]
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
