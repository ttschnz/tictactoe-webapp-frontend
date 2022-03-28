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
        this.state = { email: "", password: "", username: "" };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    async handleSubmit(e: SyntheticEvent) {
        // prevent default action to just reload the page
        e.preventDefault();
        // logging
        console.log("submitting form:", this.state);

        // get values
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

    handleValueChange(e: SyntheticEvent) {
        const target = e.target as HTMLInputElement;
        const value =
            target.type === "checkbox" ? String(target.checked) : target.value;
        const name = target.name;

        switch (name) {
            case "email":
                this.setState({ email: value });
                break;
            case "password":
                this.setState({ password: value });
                break;
            case "username":
                this.setState({ username: value });
                break;
        }
    }
    render(): React.ReactNode {
        return (
            <FlexContainer direction="column" gap={0}>
                <form onSubmit={this.handleSubmit}>
                    <Space height={22} />
                    <Heading level={1}>Sign up</Heading>
                    <Space height={22} />
                    <Input
                        label="E-Mail"
                        type="email"
                        name="email"
                        autoComplete="email"
                        onChange={this.handleValueChange}
                    ></Input>
                    <Input
                        label="Username"
                        type="text"
                        name="username"
                        autoComplete="username"
                        onChange={this.handleValueChange}
                    ></Input>
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        onChange={this.handleValueChange}
                    ></Input>
                    <Button primary>Create Account</Button>
                    {this.state.error ? (
                        <ErrorSpan>{this.state.error}</ErrorSpan>
                    ) : null}
                </form>
                <LabeledDivider label="or" />
                <Button action="/login">Log in</Button>
            </FlexContainer>
        );
    }
}
function _SignUp(props: {}) {
    const navigation = useNavigate();
    return <SignUp {...props} navigation={navigation} />;
}

export default _SignUp;
