import React from "react";
import forge from "node-forge";

import Heading from "../Heading";
import Space from "../Space";
import Input from "../Input";
import Button from "../Button";
import ErrorSpan from "../ErrorSpan";
import LabeledDivider from "../LabeledDivider";
import { SyntheticEvent } from "react";
import { api } from "../../api/apiService";
import { setCredentials } from "../../api/credentials";
import { Credentials } from "../../utils/types";
import { NavigateFunction, useNavigate } from "react-router-dom";
import FlexContainer from "../FlexContainer";

/**
 * A component that renders the login page.
 * @component
 * @hideconstructor
 */
class Login extends React.Component<
    { navigation: NavigateFunction },
    {
        password: string;
        username: string;
        error?: string;
    }
> {
    constructor(props: any) {
        super(props);

        // initialize state with empty strings
        this.state = { password: "", username: "", error: undefined };

        // bind functions
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    // handle submission of the form
    async handleSubmit(e: SyntheticEvent) {
        // prevent default action to just reload the page
        e.preventDefault();
        // logging
        console.log("submitting form:", this.state);

        // get values
        const { username, password } = this.state;
        // get the salt for the user
        const saltResponse = await api("/getsalt", {
            username,
        });
        if (!saltResponse.success)
            return this.setState({
                error: "Failed to log in. Please verify your username.",
            });

        // decode the salt
        const salt = forge.util.hexToBytes(saltResponse.data);
        // use the salt for key generation
        const key = forge.util.bytesToHex(
            forge.pkcs5.pbkdf2(password, salt, 12, 32)
        );

        // try to log in and get an access token
        const loginResponse = await api("/login", {
            username,
            key,
        });
        if (!loginResponse.success)
            return this.setState({
                error: "Failed to log in. Please verify your password.",
            });

        // set the credentials in the local storage
        setCredentials({
            username: username as string,
            token: loginResponse.data.token as string,
            tokenExpiration: loginResponse.data.token_expires as number,
            inCompetition: loginResponse.data.inCompetition as boolean,
        } as Credentials);

        // navigate to the home page
        this.props.navigation("/");
    }

    // handle value change for username and password
    handleValueChange(e: SyntheticEvent) {
        // get the target
        const target = e.target as HTMLInputElement;
        // get the value of the target
        const value =
            target.type === "checkbox" ? String(target.checked) : target.value;

        // get the name of the target
        const name = target.name;

        // update the state
        switch (name) {
            case "password":
                // update the password
                this.setState({ password: value });
                break;
            case "username":
                // update the username
                this.setState({ username: value });
                break;
        }
    }

    render(): React.ReactNode {
        return (
            <FlexContainer direction="column" gap={0}>
                <form onSubmit={this.handleSubmit}>
                    <Space height={22} />
                    {/* title */}
                    <Heading level={1}>Log in</Heading>
                    <Space height={22} />
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
                        autoComplete="current-password"
                        onChange={this.handleValueChange}
                    ></Input>
                    {/* submission button */}
                    <Button primary>Log in</Button>
                    {/* error */}
                    {this.state.error ? (
                        <ErrorSpan>{this.state.error}</ErrorSpan>
                    ) : null}
                </form>
                <LabeledDivider label="or" />
                {/* sign up button */}
                <Button action="/signup">Create Account</Button>
            </FlexContainer>
        );
    }
}

// pass the navigation function to the component
function _Login(props: {}) {
    const navigation = useNavigate();
    return <Login {...props} navigation={navigation} />;
}

// export the component as the default export
export default _Login;
