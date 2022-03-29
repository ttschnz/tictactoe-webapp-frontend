import React, { SyntheticEvent } from "react";

import Space from "../Space";
import Heading from "../Heading";
import Input from "../Input";
import Button from "../Button";
import LabeledDivider from "../LabeledDivider";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { setCredentials } from "../../api/credentials";
import forge from "node-forge";
import { api } from "../../api/apiService";
import { Credentials } from "../../utils/types";
import ErrorSpan from "../ErrorSpan";
import FlexContainer from "../FlexContainer";

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
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    async handleSubmit(e: SyntheticEvent) {
        // prevent default action (reloading the page)
        e.preventDefault();
        // logging
        console.log("submitting form:", this.state);

        // get values from state
        const { username, password, email } = this.state;
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
        if (!response.success)
            return this.setState({
                error: "Failed to sign up. ",
            });

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
        } else {
            // if only signup was made, go to login
            this.props.navigation("/login");
        }
    }
    // handle value changes in the form
    handleValueChange(e: SyntheticEvent) {
        // get the target element
        const target = e.target as HTMLInputElement;
        // get the value of the target element
        const value =
            target.type === "checkbox" ? String(target.checked) : target.value;
        // get the name of the input field
        const name = target.name as "email" | "username" | "password";
        // update the state with the new value
        this.setState({ [name]: value } as {
            [key in "email" | "username" | "password"]: string;
        });
    }

    // render the component
    render(): React.ReactNode {
        return (
            <FlexContainer direction="column" gap={0}>
                <form onSubmit={this.handleSubmit}>
                    {/* heading */}
                    <Space height={22} />
                    <Heading level={1}>Sign up</Heading>
                    <Space height={22} />
                    {/* email */}
                    <Input
                        label="E-Mail"
                        type="email"
                        name="email"
                        autoComplete="email"
                        onChange={this.handleValueChange}
                    ></Input>
                    {/* username */}
                    <Input
                        label="Username"
                        type="text"
                        name="username"
                        autoComplete="username"
                        onChange={this.handleValueChange}
                    ></Input>
                    {/* password */}
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        onChange={this.handleValueChange}
                    ></Input>
                    {/* submit button */}
                    <Button primary>Create Account</Button>
                    {/* error */}
                    {this.state.error ? (
                        <ErrorSpan>{this.state.error}</ErrorSpan>
                    ) : null}
                </form>
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
