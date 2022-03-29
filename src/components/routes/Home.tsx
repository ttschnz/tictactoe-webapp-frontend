import React from "react";
import Button from "../Button";
import FlexContainer from "../FlexContainer";
import Heading from "../Heading";
import Logo from "../logo";
import Space from "../Space";
import LabeledDivider from "../LabeledDivider";
import { getCredentials, setCredentials } from "../../api/credentials";
import { credentialChange } from "../../utils/subjects";
import { Subscription } from "rxjs";
/**
 * A component that renders the home page.
 * @component
 * @hideconstructor
 */
class Home extends React.Component<
    {},
    { loggedIn: boolean; username: string }
> {
    credentialChangeSubscription?: Subscription;
    constructor(props: {}) {
        super(props);
        // bind functions
        this.recalculateState = this.recalculateState.bind(this);
        // initialize state
        this.state = this.recalculateState();
    }
    /**
     * Recalculates the state of the component.
     */
    recalculateState() {
        // get credentials
        const credentials = getCredentials();
        // find out if the user is logged in
        const newState = {
            loggedIn: !!credentials,
            username: credentials ? credentials.username : "",
        };
        // update state
        this.setState(newState);
        // return new state
        return newState;
    }
    componentDidMount() {
        // subscribe to changes in credentials
        this.credentialChangeSubscription = credentialChange.subscribe({
            next: this.recalculateState,
        });
        // if the user is logged in, subscribe to changes in the user's credentials (e.g. logout)
        if (getCredentials()) credentialChange.next(getCredentials());
    }
    componentWillUnmount() {
        // unsubscribe from subscriptions
        if (this.credentialChangeSubscription)
            this.credentialChangeSubscription.unsubscribe();
    }
    // renders the logo and title
    getLogoTitle() {
        return (
            <FlexContainer direction="column">
                <Space height={10} />
                <FlexContainer
                    direction="row"
                    verticalCenter
                    horizontalCenter
                    gap={15}
                >
                    {/* logo */}
                    <Logo></Logo>
                    {/* title */}
                    <Heading level={1}>TicTacToe</Heading>
                </FlexContainer>
            </FlexContainer>
        );
    }
    // gets the content of the home page
    getMenu() {
        // if the user is logged in, show different options
        if (this.state.loggedIn)
            return (
                <FlexContainer direction="column" gap={10}>
                    <LabeledDivider label="Your Account" />
                    <Button action="/games/new" primary>
                        New game
                    </Button>
                    <Button action="/games/join">Join game</Button>
                    <Button action={`/users/@${this.state.username}`}>
                        View stats
                    </Button>
                    <Button
                        action={() => {
                            setCredentials(false);
                        }}
                    >
                        Log out
                    </Button>
                    <LabeledDivider label="General" />
                    <Button action="/games">Browse games</Button>
                    <Button action="/users">Browse users</Button>
                    <Button action="/competition" primary>
                        View competition
                    </Button>
                </FlexContainer>
            );
        else
            return (
                <FlexContainer direction="column" gap={10}>
                    <Button action="/games/new" primary>
                        Play as guest
                    </Button>
                    <Button action="/games/join">Join game</Button>
                    <Button action="/games">Browse games</Button>
                    <Button action="/users">Browse users</Button>
                    <Button action="/competition">View competition</Button>
                    <LabeledDivider label="or" />
                    <Button action="/signup" primary>
                        Create account
                    </Button>
                    <Button action="/login">Log in</Button>
                </FlexContainer>
            );
    }

    render(): React.ReactNode {
        return (
            <FlexContainer direction="column" gap={10}>
                {/* logo and title */}
                {this.getLogoTitle()}
                <Space height={10} />
                {/* menu */}
                {this.getMenu()}
            </FlexContainer>
        );
    }
}

export default Home;
