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

export function parseUsername(username: string): string {
    if (username.startsWith("@")) {
        return username.replace("@", "");
    } else return username;
}

class UserInfo extends React.Component<
    { username: string },
    { games?: PostGameInfo[]; userFound?: boolean }
> {
    constructor(props: any) {
        super(props);
        this.state = { games: undefined, userFound: undefined };
    }
    async componentDidMount() {
        let response = await api(
            `/users/${parseUsername(this.props.username)}`
        );
        if (response.success) {
            this.setState({
                games: response.data.games,
                userFound: true,
            });
        } else {
            this.setState({ userFound: false });
        }
    }
    render(): React.ReactNode {
        return (
            <FlexContainer
                direction="row"
                gap={20}
                horizontalCenter
                verticalCenter
            >
                {this.state.userFound !== false && this.getGames()}
                {this.state.userFound === false && this.getNotFound()}
            </FlexContainer>
        );
    }
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
                        <Heading level={1}>User not found</Heading>
                        <SubHeading>
                            <UserSpan
                                username={parseUsername(this.props.username)}
                            />
                        </SubHeading>
                    </FlexContainer>
                    <Space height={10} />
                    <LabeledDivider label="Alternatives" />
                    <Button action="/users" primary>
                        Browse users
                    </Button>
                    <Button action="/">Home</Button>
                    <Button action="/games/new">New game</Button>
                </FlexContainer>
            </Tile>
        );
    }
    getGames(): React.ReactNode[] {
        if (this.state.games === undefined) return [<Loading key="loading" />];
        else if (this.state.games.length === 0)
            return [<span key="noGames">No games</span>];
        else return this.state.games.map(createGameTile);
    }
}

function _UserInfo() {
    const { username } = useParams();
    return <UserInfo username={username as string} />;
}

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
                {this.props.value !== undefined ? (
                    <span className="UserStatsPart-Value">
                        {this.props.value}
                    </span>
                ) : (
                    <LoadingValue className="UserStatsPart-Value" />
                )}
            </FlexContainer>
        );
    }
}
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
    async loadState() {
        const response = await api(`/users/${this.props.username}`);
        if (!response.success) {
            this.setState({
                userFound: false,
            });
            return console.log("ERROR GETTING USER INFO");
        } else {
            this.setState({
                userFound: true,
            });
        }
        const data = response.data.games as PostGameInfo[];
        if (data) {
            this.setState({
                gamesPlayed: data.filter((_gameInfo) => true).length,
                gamesWon: data.filter(
                    (gameInfo) => gameInfo.winner === this.props.username
                ).length,
                gamesLost: data.filter((gameInfo) =>
                    gameInfo.isFinished &&
                    !gameInfo.isDraw &&
                    gameInfo.winner !== this.props.username
                        ? 1
                        : 0
                ).length,
                ongoingGames: data.filter((gameInfo) =>
                    !gameInfo.isFinished ? 1 : 0
                ).length,
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
    getStatsParts(): JSX.Element[] {
        const parts: { name: string; value?: number }[] = [
            { name: "Games Played", value: this.state.gamesPlayed },
            { name: "Games Won", value: this.state.gamesWon },
            { name: "Games Lost", value: this.state.gamesLost },
            { name: "Ongoing Games", value: this.state.ongoingGames },
            { name: "Streak", value: this.state.streak },
        ];
        return parts.map((value) => (
            <UserStatsPart
                name={value.name}
                value={value.value}
                key={value.name}
            />
        ));
    }
    render(): React.ReactNode {
        return this.state.userFound ? (
            <Tile className="UserStats">
                <FlexContainer direction="column">
                    <Heading level={1}>
                        <UserSpan username={this.props.username} />
                    </Heading>
                    <FlexContainer direction="row" className="UserStatsParts">
                        {this.getStatsParts()}
                    </FlexContainer>
                </FlexContainer>
            </Tile>
        ) : null;
    }
}
function _UserStats() {
    const { username } = useParams();
    return <UserStats username={parseUsername(username as string)} />;
}
_UserInfo.UserStats = _UserStats;
export default _UserInfo;
