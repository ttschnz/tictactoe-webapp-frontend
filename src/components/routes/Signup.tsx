import React from "react";

import Button from "../Button";
import LabeledDivider from "../LabeledDivider";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { setCredentials } from "../../api/credentials";
import forge from "node-forge";
import { api } from "../../api/apiService";
import { Credentials } from "../../utils/types";
import FlexContainer from "../FlexContainer";
import Form from "../Form";
import jsUtils from "../../utils/jsUtils";

/**
 * A component that displays a signup form.
 * @component
 * @hideconstructor
 */
class SignUp extends React.Component<
    { navigation: NavigateFunction },
    {
        email: string;
        password: string;
        username: string;
        error?: string;
    }
> {
    constructor(props: any) {
        super(props);
        // initialize state with empty values
        this.state = { email: "", password: "", username: "" };
        // bind functions to this
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    async handleSubmit(values: { [key: string]: string }) {
        // logging
        console.log("submitting form:", values);
        // get values
        const { username, password, email } = values;
        // generate a random salt
        let salt = forge.random.getBytesSync(128);

        // use the salt to derive the key with pbkdf2 (https://en.wikipedia.org/wiki/PBKDF2)
        const key = forge.util.bytesToHex(
            forge.pkcs5.pbkdf2(password, salt, 12, 32)
        );
        // hexify bytes to prevent encoding bugs on serverside
        salt = forge.util.bytesToHex(salt);

        // try to log in and get an access token
        const response = await api("/signup", {
            username,
            email,
            key,
            salt,
        });
        // if the response was unsuccessful, display an error
        if (!response.success) return "Failed to sign up. Please try again.";

        // signup was successful, check if direct-login was enabled
        if (response.data.token) {
            // if a token is already proviced (direct-login), save it and go home
            setCredentials({
                token: response.data.token,
                tokenExpiration: response.data.token_expires,
                username: username,
                inCompetition: response.data.inCompetition,
            } as Credentials);
            this.props.navigation("/");
            return null;
        } else {
            // if only signup was made, go to login
            this.props.navigation("/login");
            return null;
        }
    }
    componentDidMount() {
        // set the page title
        jsUtils.changeTitle("Sign Up");
    }
    // render the component
    render(): React.ReactNode {
        return (
            <FlexContainer direction="column" gap={0}>
                <Form
                    onSubmit={this.handleSubmit}
                    heading="Sign up"
                    submit={{ label: "Create Account" }}
                    fields={{
                        email: {
                            label: "Email",
                            type: "email",
                            required: true,
                            autoComplete: "email",
                        },
                        username: {
                            label: "Username",
                            type: "text",
                            required: true,
                            autoComplete: "username",
                        },
                        password: {
                            label: "Password",
                            type: "password",
                            required: true,
                            autoComplete: "new-password",
                        },
                    }}
                />
                <LabeledDivider label="or" />
                {/* login if you already have an account */}
                <Button action="/login">Log in</Button>
            </FlexContainer>
        );
    }
}

// pass the navigation function to the component
function _SignUp(props: {}) {
    const navigation = useNavigate();
    return <SignUp {...props} navigation={navigation} />;
}

export default _SignUp;
