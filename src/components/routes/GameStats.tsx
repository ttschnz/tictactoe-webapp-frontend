import React from "react";
import { PostGameInfo } from "../../utils/types";
import { Subscription } from "rxjs";
import { gameChange } from "../../utils/subjects";
import {
    loadGame,
    gameStorage,
    gameIdToHex,
    gameIdFromHex,
    hasAccessToGame,
} from "../../utils/gameUtils";
import { getCredentials } from "../../api/credentials";
import Tile from "../Tile";
import Heading from "../Heading";
import { getGameState } from "./GameOverview";
import classNames from "classnames";
import FlexContainer from "../FlexContainer";
import { useParams } from "react-router-dom";
import Error404 from "./Error404";
import UserSpan from "../UserSpan";
// import jsUtils from "../../utils/jsUtils";
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

        // since this is not a fullscreen component, we don't need to change the title of the page
        // jsUtils.changeTitle(`Game #${gameIdToHex(this.props.gameId)}`);
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
 * Pass the gameId from the matched URL to the GameStats component.
 */
function _GameStats() {
    const { gameId } = useParams();
    if (gameId) return <GameStats gameId={gameIdFromHex(gameId)} />;
    else return <Error404 />;
}

export default _GameStats;
