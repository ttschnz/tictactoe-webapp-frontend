import React from "react";
import Tile from "../Tile";
import FlexContainer from "../FlexContainer";
import { Link } from "react-router-dom";
import Heading from "../Heading";
import GameField from "../GameField";
import { GameMetaData, PostGameInfo } from "../../utils/types";
import UserSpan from "../UserSpan";
import Button from "../Button";
import "../GameOverview.css";
import { api } from "../../api/apiService";
import Loading from "../Loading";
import uniquify from "../../utils/uniquify";
import { gameIdToHex } from "../../utils/gameUtils";
import Space from "../Space";
import { hasAccessToGame } from "./Game";

/**
 * A component that renders a game overview.
 * @component
 * @hideconstructor
 */
class GameOverview extends React.Component<
    {},
    { games?: PostGameInfo[]; hasMoreGames: boolean; successful?: boolean }
> {
    constructor(props: any) {
        super(props);
        // initialize state
        this.state = { games: undefined, hasMoreGames: true };
    }

    async componentDidMount() {
        // load games from the API
        let response = await api("/games");
        // if the response is successful, update the state
        if (response.success) {
            this.setState({
                games: response.data,
                successful: true,
            });
        } else {
            // if the response is not successful, update the state to show an error
            this.setState({ successful: false });
        }
    }
    render(): React.ReactNode {
        console.log("rendering game overview", this.state);
        return (
            <FlexContainer
                direction="row"
                gap={20}
                horizontalCenter
                verticalCenter
            >
                {/* if the request was successful, show the games */}
                {this.state.successful !== false && this.getGames()}
                {/* if the request was not successful, show an error */}
                {this.state.successful === false && this.getFailed()}
            </FlexContainer>
        );
    }
    /**
     * Renders an error message.
     * @returns an error message
     */
    getFailed(): React.ReactNode {
        return (
            <Tile>
                <FlexContainer direction="column" gap={10}>
                    <Space height={10} />
                    <FlexContainer
                        direction="column"
                        gap={10}
                        horizontalCenter
                        verticalCenter
                    >
                        {/* Tell the user that the request has failed */}
                        <Heading level={1}>Failed to load games</Heading>
                    </FlexContainer>
                    <Space height={10} />
                    <span>Please try again later</span>
                </FlexContainer>
            </Tile>
        );
    }
    /**
     * Renders the games.
     * @returns a list of games
     */
    getGames(): React.ReactNode[] {
        if (this.state.games === undefined) return [<Loading key="loading" />];
        else if (this.state.games.length === 0)
            return [<span key="noGames">No games</span>];
        else
            return [
                ...uniquify(this.state.games.map(createGameTile)),
                this.loadMoreButton(),
            ];
    }
    /**
     * Renders a button that loads more games. If there are no more games, the button is not rendered. Instead, a message is shown.
     * @returns a button that loads more games
     */
    loadMoreButton() {
        // if there are more games to load, show a button that loads more games
        if (this.state.hasMoreGames) {
            return (
                <FlexContainer
                    direction="row"
                    className="FullWidth"
                    horizontalCenter
                    key="loadMoreButton"
                >
                    <div>
                        <Button
                            action={async () => {
                                // get the game id of the last game
                                let gameId = this.state.games
                                    ? this.state.games[
                                          this.state.games.length - 1
                                      ].gameId
                                    : undefined;
                                // load all games after the last game
                                let response = await api(`/games`, { gameId });
                                // if the response is successful, update the state
                                if (response.success) {
                                    let newGames = response.data;
                                    // if there are no more games, update the state to show that there are no more games
                                    if (newGames.length === 0)
                                        this.setState({ hasMoreGames: false });
                                    // otherwise, update the state to show the new games
                                    this.setState((currentState) => {
                                        // if the state is undefined, initialize it
                                        let newState = {
                                            games: currentState.games ?? [],
                                        };
                                        // add the new games to the state
                                        newState.games.push(...newGames);
                                        // return the new state
                                        return newState;
                                    });
                                }
                            }}
                        >
                            Load more
                        </Button>
                    </div>
                </FlexContainer>
            );
        }
        // if there are no more games to load, show a message
        else
            return (
                <FlexContainer
                    direction="row"
                    className="FullWidth"
                    horizontalCenter
                    key="noMore"
                >
                    <span className="Flex-NewLine">No more games</span>
                </FlexContainer>
            );
    }
}
/**
 * Determines the state of a game and returns a string that describes it.
 */
export function getGameState(
    gameInfo: PostGameInfo | GameMetaData["gameState"]
) {
    const finished =
        "isFinished" in gameInfo
            ? gameInfo.isFinished
            : gameInfo.finished || false;
    if (finished && gameInfo.winner)
        return (
            <span>
                <UserSpan username={gameInfo.winner} /> won
            </span>
        );
    else if (finished && gameInfo.isDraw) return <span>draw</span>;
    else return <span>ongoing</span>;
}

/**
 * Determines whether a game is played by the current user and if so returns a button to continue the game
 */
export function getContinueButton(gameInfo: PostGameInfo) {
    if (
        hasAccessToGame(gameInfo.gameId, gameInfo.attacker, gameInfo.defender)
    ) {
        return (
            <div className="GameTile-ContinueGameButton">
                <Button action={`/games/${gameIdToHex(gameInfo.gameId)}`}>
                    Continue
                </Button>
            </div>
        );
    } else return null;
}

/**
 * Creates a game tile showing the game's information and its state.
 */
export function createGameTile(gameInfo: PostGameInfo) {
    return (
        // create a tile showing the game's information
        <Tile key={gameIdToHex(gameInfo.gameId)}>
            <FlexContainer direction="column">
                {/* show the game id, state and continueButton */}
                <FlexContainer
                    direction="row"
                    key="gameId"
                    verticalCenter
                    className="GameTile-GameHeading"
                >
                    <Link to={`/games/${gameIdToHex(gameInfo.gameId)}`}>
                        <Heading level={2}>
                            #{gameIdToHex(gameInfo.gameId)}
                        </Heading>
                    </Link>
                    {getGameState(gameInfo)}
                    {getContinueButton(gameInfo)}
                </FlexContainer>
                {/* show the game field */}
                <FlexContainer direction="row" key="gameField">
                    <Link to={`/games/${gameIdToHex(gameInfo.gameId)}`}>
                        <GameField
                            gameField={gameInfo.gameField}
                            sizeValue={360}
                            sizeUnit="px"
                            gameId={gameInfo.gameId}
                            useNewSocket={false}
                            editable={false}
                        />
                    </Link>
                </FlexContainer>
                {/* show the game's players */}
                <FlexContainer direction="column" key="gameMeta">
                    {/* show the attacker */}
                    <FlexContainer
                        direction="row"
                        verticalCenter
                        className="GameTile-Attacker"
                        key="gameAttacker"
                    >
                        <Heading level={3}>
                            <UserSpan username={gameInfo.attacker} />
                        </Heading>
                        <span>Attacker</span>
                    </FlexContainer>
                    {/* show the defender */}
                    <FlexContainer
                        direction="row"
                        verticalCenter
                        className="GameTile-Defender"
                        key="gameDefender"
                    >
                        <Heading level={3}>
                            <UserSpan username={gameInfo.defender} />
                        </Heading>
                        <span>Defender</span>
                    </FlexContainer>
                </FlexContainer>
            </FlexContainer>
        </Tile>
    );
}
export default GameOverview;
