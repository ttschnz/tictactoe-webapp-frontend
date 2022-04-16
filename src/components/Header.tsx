import React from "react";
import { Link } from "react-router-dom";
import UserSpan from "./UserSpan";
import "./Header.css";
import Button from "./Button";
import Logo from "./logo";

import { getCredentials, setCredentials } from "../api/credentials";
import FlexContainer from "./FlexContainer";
import { credentialChange, locationChange } from "../utils/subjects";
import { Subscription } from "rxjs";
import { Credentials } from "../utils/types";
/**
 * A header component that can be used to display the header of the application.
 * It displays the logo, the user name and a logout button if the user is logged in.
 * @component
 * @hideconstructor
 */
class Header extends React.Component<
    {},
    {
        username: string | false;
        url: string;
    }
> {
    logoutListener: any;
    loginListener: any;
    locationChangeSubscription?: Subscription;
    credentialChangeSubscription?: Subscription;

    constructor(props: any) {
        super(props);
        // get the credentials
        const credentials = getCredentials();
        this.state = {
            // set the username to the username from the credentials or false if there are no credentials
            username: credentials ? credentials.username : false,
            // set the url to the current url
            url: document.location.pathname,
        };
        // bind the functions to this
        this.locationChange = this.locationChange.bind(this);
        this.credentialChange = this.credentialChange.bind(this);
    }
    // update the state to a new url
    locationChange(newUrl: any) {
        this.setState({ url: newUrl });
    }
    // update the state to a new username
    credentialChange(credents: Credentials | false) {
        this.setState({
            username: credents ? credents.username : false,
        });
    }
    componentDidMount() {
        // subscribe to credential changes and location changes to update the state
        this.credentialChangeSubscription = credentialChange.subscribe({
            next: this.credentialChange,
        });
        this.locationChangeSubscription = locationChange.subscribe({
            next: this.locationChange,
        });
    }
    componentWillUnmount() {
        // unsubscribe from credential changes and location changes
        if (this.locationChangeSubscription)
            this.locationChangeSubscription.unsubscribe();
        if (this.credentialChangeSubscription)
            this.credentialChangeSubscription.unsubscribe();
    }
    // top right menu containing the username and logout button
    getTopRightMenu() {
        // if the user is logged in
        if (this.state.username)
            // return the username and a logout button
            return (
                <FlexContainer direction="row" gap={10} verticalCenter nowrap>
                    <UserSpan username={this.state.username} />
                    <Button
                        action={() => {
                            setCredentials(false);
                        }}
                    >
                        Sign out
                    </Button>
                </FlexContainer>
            );
        // if the user is not logged in and the location doesn't start with login
        else if (!this.state.url.startsWith("/login"))
            // return a login button
            return (
                <FlexContainer direction="row" gap={10} nowrap>
                    {" "}
                    <Link to="/login">
                        <Button action={undefined}>Log in</Button>
                    </Link>
                </FlexContainer>
            );
        // if the user is not logged in and the location starts with login return nothing
        else return null;
    }
    render() {
        return (
            // return the header
            <header className="Header">
                {/* logo */}
                <Logo></Logo>
                {/* top right menu containing the username and logout button */}
                {this.getTopRightMenu()}
            </header>
        );
    }
}

export default Header;
