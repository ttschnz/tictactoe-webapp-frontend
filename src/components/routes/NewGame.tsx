import React, { SyntheticEvent } from "react";
import FlexContainer from "../FlexContainer";
import Heading from "../Heading";
import Space from "../Space";
import Tile from "../Tile";
import MaterialIcon from "../MaterialIcon";
import "./NewGame.css";
import classNames from "classnames";
import { Credentials } from "../../utils/types";
import { addGameKey, getCredentials } from "../../api/credentials";
import { Subscription } from "rxjs";
import { credentialChange } from "../../utils/subjects";
import ErrorSpan from "../ErrorSpan";
import Button from "../Button";
import { api } from "../../api/apiService";
import { NavigateFunction, useNavigate } from "react-router-dom";
/**
 * A component that displays a form for creating a new game.
 * @component
 * @hideconstructor
 */
class NewGame extends React.Component<
    { navigation: NavigateFunction },
    { credentials: Credentials | false; error: any[] | false }
> {
    subscriptions: { [key: string]: Subscription } = {};
    constructor(props: any) {
        super(props);
        this.state = {
            error: false,
            credentials: getCredentials(),
        };
        // bind functions to this
        this.handleClick = this.handleClick.bind(this);
        this.handleCredentialChange = this.handleCredentialChange.bind(this);
    }
    componentDidMount() {
        this.subscriptions.credentials = credentialChange.subscribe(
            this.handleCredentialChange
        );
    }
    componentWillUnmount() {
        this.subscriptions.credentials?.unsubscribe();
    }
    handleCredentialChange(arg: any) {
        this.setState({ credentials: getCredentials() });
    }
    render(): React.ReactNode {
        // return the component with the options for the game
        return (
            <FlexContainer direction="column" gap={10}>
                <FlexContainer direction="column" gap={10}>
                    <Space height={10} />
                    <Heading level={1}>Select Opponent</Heading>
                </FlexContainer>
                <Space height={20} />
                <FlexContainer direction="row" verticalCenter horizontalCenter>
                    {/* create a tile for each opponent */}
                    {this.options()}
                </FlexContainer>
                {this.state.error && <ErrorSpan>{this.state.error}</ErrorSpan>}
            </FlexContainer>
        );
    }
    options(): React.ReactNode[] {
        // create a tile for each opponent
        return [
            // play against the computer
            <Tile
                className="NewGame-OptionTile"
                onClick={this.handleClick}
                key="playBot"
                data-option="playBot"
            >
                <FlexContainer
                    direction="row"
                    verticalCenter
                    horizontalCenter
                    className="NewGame-OptionTile-Content"
                >
                    <MaterialIcon name="precision_manufacturing" />
                    <span>Bot</span>
                </FlexContainer>
            </Tile>,
            // play against another player
            <Tile
                className={classNames(
                    "NewGame-OptionTile",
                    !this.state.credentials && "NewGame-OptionTile-GreyedOut"
                )}
                onClick={this.handleClick}
                key="playPerson"
                data-option="playPerson"
            >
                <FlexContainer
                    direction="row"
                    verticalCenter
                    horizontalCenter
                    className="NewGame-OptionTile-Content"
                >
                    <MaterialIcon name="person" />
                    <span>Human</span>
                </FlexContainer>
            </Tile>,
        ];
    }
    // handle the click event when an option is selected
    handleClick(e: SyntheticEvent) {
        e.preventDefault();
        // get the option that was selected
        let option = (e.currentTarget as HTMLElement).dataset.option as
            | "playBot"
            | "playPerson";
        // emit the option to the parent component
        if (option === "playBot") {
            // play against the computer
            console.log("playBot");
            this.createGame(true);
        } else if (option === "playPerson") {
            // play against another player
            // the user can't play against other people if he is not logged in
            if (!this.state.credentials) {
                this.setState({
                    error: [
                        <span key="text">
                            You must be logged in to play against other people.
                        </span>,
                        <Button action="/login" key="btn">
                            Log in
                        </Button>,
                    ],
                });
                return;
            } else {
                this.setState({
                    error: false,
                });
                this.createGame(false);
            }
            console.log("playPerson");
        }
    }
    async createGame(playAgainstBot: boolean = true) {
        let response = await api("/startNewGame", { playAgainstBot }, true);
        console.log("response for starting new game", response);
        if (response.success) {
            if (response.data.gameKey)
                addGameKey(response.data.gameKey, response.data.gameId);
            let gameId = response.data.gameId;
            this.props.navigation(`/games/${gameId}`);
        }
        this.setState({ error: false });
    }
}
function _NewGame(props: {}) {
    const navigation = useNavigate();
    return <NewGame navigation={navigation} {...props} />;
}
export default _NewGame;
