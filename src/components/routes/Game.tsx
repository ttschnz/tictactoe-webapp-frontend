import React from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/apiService";
import {
    evaluatePlayer,
    gameIdFromHex,
    gameIdToHex,
} from "../../utils/gameUtils";
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
    { gameField: PostGameInfo["gameField"] | undefined[] }
> {
    constructor(props: any) {
        super(props);
        // initialize the gameField with an empty array
        this.state = { gameField: Array(9).fill(undefined) };
    }
    async componentDidMount() {
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
            } as GameMetaData;
            // get the moves of the game
            const moves = response.data.moves as Move[];
            // evaluate the game
            let gameField: PostGameInfo["gameField"] = Array(9).fill(undefined);
            for (let move of moves) {
                gameField[move.movePosition] = evaluatePlayer(
                    move.player,
                    gameMetaData.players
                );
            }
            console.log({ gameData: gameField });
            // update the gameField
            this.setState({ gameField });
        }
    }
    render(): React.ReactNode {
        return (
            <GameField
                gameField={this.state.gameField}
                gameId={this.props.gameId}
                sizeUnit="px"
                sizeValue={500}
                useNewSocket={true}
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
            } as GameMetaData;
            // update the players and gameState
            this.setState({
                players: gameMetaData.players,
                gameState: gameMetaData.gameState,
            });
        }
    }

    render(): React.ReactNode {
        return (
            <Tile className="GameStats">
                {/* show the game id */}
                <Heading level={1}>#{gameIdToHex(this.props.gameId)}</Heading>
                {/* display the current game state (ongoing, won, etc.) */}
                <span>{getGameState(this.state.gameState)}</span>
                {/* show who is attacking */}
                <FlexContainer direction="row" key="gameAttacker">
                    <Heading level={3}>Attacker:</Heading>
                    <UserSpan username={this.state.players.attacker} />
                </FlexContainer>
                {/* show who is defending */}
                <FlexContainer direction="row" key="gameDefender">
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

_Game.GameStats = _GameStats;
export default _Game;
