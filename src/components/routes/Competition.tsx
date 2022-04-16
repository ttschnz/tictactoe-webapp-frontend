import React from "react";
import FlexContainer from "../FlexContainer";
import Heading from "../Heading";
import Button from "../Button";
import Tiny from "../Tiny";
import "./Competition.css";
import Form from "../Form";
import { getCredentials, setCredentials } from "../../api/credentials";
import InfoTile from "../InfoTile";
import { Subscription } from "rxjs";
import { Credentials } from "../../utils/types";
import { credentialChange } from "../../utils/subjects";
import { api } from "../../api/apiService";
import { NavigateFunction } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import jsUtils from "../../utils/jsUtils";
/**
 * A component that renders the competition information
 * @component
 * @hideconstructor
 */
class Competition extends React.Component<
    {},
    { credentials: Credentials | false }
> {
    subscriptions: { [key: string]: Subscription } = {};
    constructor(props: any) {
        super(props);
        // bind functions to this
        this.handleCredentialChange = this.handleCredentialChange.bind(this);
        // initialize the credentials with the current credentials
        this.state = {
            credentials: getCredentials(),
        };
    }
    componentDidMount() {
        // subscribe to credential changes to update the information
        this.subscriptions.credentials = credentialChange.subscribe({
            next: this.handleCredentialChange,
        });
        jsUtils.changeTitle("Competition");
    }
    componentWillUnmount() {
        // unsubscribe from credential changes when the component unmounts
        if (this.subscriptions.credentials)
            this.subscriptions.credentials.unsubscribe();
    }
    handleCredentialChange(arg: any) {
        // update the state when the credentials change
        this.setState({ credentials: getCredentials() });
    }
    render(): React.ReactNode {
        return (
            <FlexContainer direction="column" gap={10}>
                {/* render the heading */}
                <Heading level={1} space={20}>
                    Competition
                </Heading>
                {/* {/* render the information if the user is signed in and has joined the competition */}
                {this.state.credentials &&
                    this.state.credentials.inCompetition && (
                        <InfoTile content="You are enlisted in the competition." />
                    )}
                <span>
                    To prove to you that the reinforcement learning algorithm
                    (RL-A) we developed works and is unbeatable, we developed
                    this web app. You can try your luck and beat the bot. The
                    first player to beat the bot will receive a prize in the
                    form of a bar of chocolate. To win, you need to create an
                    account and be the first player to beat the RL-A.*
                </span>
                {/* display different buttons, either sign up, start playing, or join competition */}
                {this.state.credentials &&
                    this.state.credentials.inCompetition && (
                        <Button primary action="/games/new">
                            Start Playing
                        </Button>
                    )}
                {this.state.credentials &&
                    !this.state.credentials.inCompetition && (
                        <Button primary action="./join">
                            Join Competition
                        </Button>
                    )}
                {!this.state.credentials && (
                    <Button primary action="/signup">
                        Create Account
                    </Button>
                )}
                <Tiny>
                    *We reserve the right to change the rules of the competition
                    at any time without warning, including in such a way that
                    players who would have won, lose their prize.
                </Tiny>
            </FlexContainer>
        );
    }
}
/**
 * A component that renders the competition joining form
 * @component
 * @hideconstructor
 */
class JoinCompetition extends React.Component<{
    navigation: NavigateFunction;
}> {
    constructor(props: any) {
        super(props);
        // bind functions to this
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        jsUtils.changeTitle("Join Competition");
    }
    handleSubmit(values: { [key: string]: string }): Promise<string | null> {
        return new Promise(async (resolve, _reject) => {
            // get the values from the form
            const { firstName, lastName, age, gender } = values;
            // submit to the API
            let response = await api(
                "/joinCompetition",
                {
                    firstName,
                    lastName,
                    age,
                    gender,
                },
                true
            );
            // if the request was successful
            if (response.success) {
                // update the credentials
                let credentials = getCredentials();
                if (credentials) {
                    setCredentials({ ...credentials, inCompetition: true });
                    resolve(null);
                    this.props.navigation("/competition");
                } else {
                    // the user logged out during the request, don't do anything
                    resolve(null);
                }
            } else {
                // display the error message from the server
                if (response.error)
                    resolve(`Error joining competition: ${response.error}`);
                // display a generic error message
                else
                    resolve(
                        "Error joining competition. Please check your inputs and try again later."
                    );
            }
        });
    }

    render(): React.ReactNode {
        return (
            <FlexContainer direction="column" gap={10}>
                <Form
                    onSubmit={this.handleSubmit}
                    heading="Join Competition"
                    submit={{ label: "Join Competition" }}
                    fields={{
                        firstName: {
                            label: "First Name",
                            type: "text",
                            required: true,
                        },
                        lastName: {
                            label: "Last Name",
                            type: "text",
                        },
                        age: {
                            label: "Age",
                            type: "number",
                        },
                        gender: {
                            label: "Gender (m/f/?)",
                            type: "text",
                        },
                    }}
                />
                <Tiny>
                    By joining the competition, you agree to our terms. We
                    reserve the right to change the rules of the competition at
                    any time without warning, including in such a way that
                    players who would have won, lose their prize.
                </Tiny>
            </FlexContainer>
        );
    }
}
function _JoinCompetition(props: any) {
    let navigation = useNavigate();
    return <JoinCompetition navigation={navigation} />;
}
export { _JoinCompetition as JoinCompetition };
export default Competition;
