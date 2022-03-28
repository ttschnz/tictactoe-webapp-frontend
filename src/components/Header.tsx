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
        const credentials = getCredentials();
        this.state = {
            username: credentials ? credentials.username : false,
            url: document.location.pathname,
        };
        this.locationChange = this.locationChange.bind(this);
        this.credentialChange = this.credentialChange.bind(this);
    }
    locationChange(newUrl: any) {
        this.setState({ url: newUrl });
    }
    credentialChange(_arg: any) {
        const credents = getCredentials();
        this.setState({
            username: credents ? credents.username : false,
        });
    }
    componentDidMount() {
        // subscribe to credential changes and location changes
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
    getTopRightMenu() {
        if (this.state.username)
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
        else if (!this.state.url.startsWith("/login"))
            return (
                <FlexContainer direction="row" gap={10} nowrap>
                    {" "}
                    <Link to="/login">
                        <Button action={undefined}>Log in</Button>
                    </Link>
                </FlexContainer>
            );
        else return null;
    }
    render() {
        return (
            <header className="Header">
                <Logo></Logo>
                {this.getTopRightMenu()}
            </header>
        );
    }
}

export default Header;
