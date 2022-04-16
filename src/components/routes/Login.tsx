import React from "react";
import forge from "node-forge";

import Form from "../Form";
import Button from "../Button";
import LabeledDivider from "../LabeledDivider";
import { api } from "../../api/apiService";
import { setCredentials } from "../../api/credentials";
import { Credentials } from "../../utils/types";
import { NavigateFunction, useNavigate } from "react-router-dom";
import FlexContainer from "../FlexContainer";
import jsUtils from "../../utils/jsUtils";

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
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    // handle submission of the form
    async handleSubmit(values: { [key: string]: string }) {
        // logging
        console.log("submitting form:", values);

        // get values
        const { username, password } = values;
        // get the salt for the user
        const saltResponse = await api("/getsalt", {
            username,
        });
        if (!saltResponse.success)
            return "Failed to log in. Please verify your username.";

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
            return "Failed to log in. Please verify your password.";

        // set the credentials in the local storage
        setCredentials({
            username: username as string,
            token: loginResponse.data.token as string,
            tokenExpiration: loginResponse.data.token_expires as number,
            inCompetition: loginResponse.data.inCompetition as boolean,
        } as Credentials);

        // navigate to the home page
        this.props.navigation("/");
        return null;
    }
    componentDidMount() {
        jsUtils.changeTitle("Log in");
    }
    render(): React.ReactNode {
        return (
            <FlexContainer direction="column" gap={0}>
                <Form
                    heading="Log in"
                    onSubmit={this.handleSubmit}
                    submit={{ label: "Log in" }}
                    fields={{
                        username: {
                            label: "Username",
                            type: "text",
                            autoComplete: "username",
                            required: true,
                        },
                        password: {
                            label: "Password",
                            type: "password",
                            autoComplete: "current-password",
                            required: true,
                        },
                    }}
                />
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
