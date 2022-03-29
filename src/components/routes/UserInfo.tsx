import React from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/apiService";
import FlexContainer from "../FlexContainer";
import Heading, { SubHeading } from "../Heading";
import UserSpan from "../UserSpan";
import Tile from "../Tile";

import Loading, { LoadingValue } from "../Loading";
import "./userStats.css";
import { PostGameInfo } from "../../utils/types";
import { createGameTile } from "./GameOverview";
import Button from "../Button";
import LabeledDivider from "../LabeledDivider";
import Space from "../Space";

// remove the at sign from the username to get the user id
export function parseUsername(username: string): string {
    if (username.startsWith("@")) {
        return username.replace("@", "");
    } else return username;
}

/**
 * A component that displays a user's stats.
 * TODO: update the games when user changes. currently the games don't update
 * @component
 * @hideconstructor
 */
class UserInfo extends React.Component<
    { username: string },
    { games?: PostGameInfo[]; userFound?: boolean }
> {
    constructor(props: any) {
        super(props);
        // initialize state with empty values
        this.state = { games: undefined, userFound: undefined };
    }
    componentDidMount() {
        this.updateGames();
    }

    // render the component
    render(): React.ReactNode {
        return (
            <FlexContainer
                direction="row"
                gap={20}
                horizontalCenter
                verticalCenter
            >
                {/* if the user was found, display their stats */}
                {this.state.userFound !== false && this.getGames()}
                {/* if the user was not found, display an error */}
                {this.state.userFound === false && this.getNotFound()}
            </FlexContainer>
        );
    }
    async updateGames() {
        // get the user's games
        let response = await api(
            `/users/${parseUsername(this.props.username)}`
        );
        // if the user was found
        if (response.success) {
            // set the state to the user's games
            this.setState({
                games: response.data.games,
                userFound: true,
            });
        } else {
            // if the user was not found, display an error
            this.setState({ userFound: false });
        }
    }
    // returns an error message saying the user was not found
    getNotFound(): React.ReactNode {
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
                        {/* display the error message as a heading */}
                        <Heading level={1}>User not found</Heading>
                        {/* display the username as subheading */}
                        <SubHeading>
                            <UserSpan
                                username={parseUsername(this.props.username)}
                            />
                        </SubHeading>
                    </FlexContainer>
                    <Space height={10} />
                    <LabeledDivider label="Alternatives" />
                    {/* display a button to browse all users */}
                    <Button action="/users" primary>
                        Browse users
                    </Button>
                    {/* display a button to go back to the home page */}
                    <Button action="/">Home</Button>
                    {/* display a button to create a new game */}
                    <Button action="/games/new">New game</Button>
                </FlexContainer>
            </Tile>
        );
    }
    // returns a list of games
    getGames(): React.ReactNode[] {
        // this.updateGames();
        // display a loading icon if the games are not loaded yet
        if (this.state.games === undefined) return [<Loading key="loading" />];
        // if the user has no games, display a message saying so
        else if (this.state.games.length === 0)
            return [<span key="noGames">No games</span>];
        // if the user has games, display them
        else return this.state.games.map(createGameTile);
    }
}

// parse the username from the url and pass it to the component as a prop
function _UserInfo() {
    const { username } = useParams();
    return <UserInfo username={username as string} />;
}

/**
 * A component that displays a user's stats part.
 * @component
 * @hideconstructor
 * @example
 * <UserStatsPart name="highscore" value={90} />
 */
class UserStatsPart extends React.Component<
    { name: string; value?: number },
    {}
> {
    render(): React.ReactNode {
        return (
            <FlexContainer direction="column" horizontalCenter gap={0}>
                <Heading level={2} className="UserStatsPart-Name">
                    {this.props.name}
                </Heading>
                {/* if the value is not undefined, display it */}
                {this.props.value !== undefined ? (
                    <span className="UserStatsPart-Value">
                        {this.props.value}
                    </span>
                ) : (
                    // if the value is undefined, display a loading animation
                    <LoadingValue className="UserStatsPart-Value" />
                )}
            </FlexContainer>
        );
    }
}

/**
 * A component that displays a user's stats.
 * @component
 * @hideconstructor
 * @example
 * <UserStats username="user" /> // displays the user's stats (note: the username must be parsed already)
 */
class UserStats extends React.Component<
    { username: string },
    {
        gamesPlayed?: number;
        gamesWon?: number;
        gamesLost?: number;
        ongoingGames?: number;
        streak?: number;
        userFound?: boolean;
    }
> {
    constructor(props: any) {
        super(props);
        this.state = {
            gamesPlayed: undefined,
            gamesWon: undefined,
            gamesLost: undefined,
            ongoingGames: undefined,
            streak: undefined,
            userFound: undefined,
        };
    }
    componentDidMount() {
        this.loadState();
    }
    // updates the state with the user's stats
    async loadState() {
        // get the user's stats from the api
        const response = await api(`/users/${this.props.username}`);
        // if the user was not found
        if (!response.success) {
            // set the state to the error
            this.setState({
                userFound: false,
            });
            return console.log("ERROR GETTING USER INFO");
        } else {
            // if the user was found
            // define that the user was found in the state
            this.setState({
                userFound: true,
            });
        }
        // get the games played from the response
        const data = response.data.games as PostGameInfo[];
        // if the user has games
        if (data) {
            this.setState({
                // get the number of games played
                gamesPlayed: data.filter((_gameInfo) => true).length,
                // get the number of games won
                gamesWon: data.filter(
                    (gameInfo) => gameInfo.winner === this.props.username
                ).length,
                // get the number of games lost
                gamesLost: data.filter((gameInfo) =>
                    gameInfo.isFinished &&
                    !gameInfo.isDraw &&
                    gameInfo.winner !== this.props.username
                        ? 1
                        : 0
                ).length,
                // get the number of ongoing games
                ongoingGames: data.filter((gameInfo) =>
                    !gameInfo.isFinished ? 1 : 0
                ).length,
                // get the current streak
                streak: (
                    data
                        .filter((gameInfo) => gameInfo.isFinished)
                        .map((gameInfo: PostGameInfo) =>
                            gameInfo.winner === this.props.username ? 1 : 0
                        )
                        .join("")
                        .split("0")
                        .shift() ?? ""
                ).length,
            });
        }
    }
    // returns the user's stats as a list of stats parts (Elements)
    getStatsParts(): JSX.Element[] {
        // define which values to display
        const values: { name: string; value?: number }[] = [
            { name: "Games Played", value: this.state.gamesPlayed },
            { name: "Games Won", value: this.state.gamesWon },
            { name: "Games Lost", value: this.state.gamesLost },
            { name: "Ongoing Games", value: this.state.ongoingGames },
            { name: "Streak", value: this.state.streak },
        ];
        // map the values to the stats parts
        return values.map((value) => (
            <UserStatsPart
                name={value.name}
                value={value.value}
                key={value.name}
            />
        ));
    }
    render(): React.ReactNode {
        // if the user was found, display the stats
        return this.state.userFound ? (
            <Tile className="UserStats">
                <FlexContainer direction="column">
                    <Heading level={1}>
                        {/* display the user's username */}
                        <UserSpan username={this.props.username} />
                    </Heading>
                    {/* display the user's stats */}
                    <FlexContainer direction="row" className="UserStatsParts">
                        {this.getStatsParts()}
                    </FlexContainer>
                </FlexContainer>
            </Tile>
        ) : // if the user was not found, return null
        null;
    }
}
// parse the username from the url, parse it and pass it to the component as a prop
function _UserStats() {
    const { username } = useParams();
    return <UserStats username={parseUsername(username as string)} />;
}
_UserInfo.UserStats = _UserStats;
export default _UserInfo;
