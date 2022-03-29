import React from "react";

import "./App.css";

import Header from "./Header";
import Footer from "./Footer";
import Home from "./routes/Home";
import Login from "./routes/Login";
import NewGame from "./routes/NewGame";
import Game from "./routes/Game";
import SignUp from "./routes/Signup";
import UserInfo from "./routes/UserInfo";
import UserOverview from "./routes/UserOverview";
import GameOverview from "./routes/GameOverview";
import Competition, { JoinCompetition } from "./routes/Competition";
import JoinGame from "./routes/JoinGame";
import Error404 from "./routes/Error404";
import HomeLink from "./HomeLink";
import Tile from "./Tile";

import { getCredentials, setCredentials } from "../api/credentials";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
    credentialChange,
    errorResolveSubject,
    errorSubject,
} from "../utils/subjects";
import Popup from "./Popup";
import { Subscription } from "rxjs";
import { Credentials } from "../utils/types";
import { Navigate } from "react-router-dom";
/**
 * The main application component.
 * @component
 * @hideconstructor
 */
class App extends React.Component<
    {},
    {
        popups: { [key: string]: string };
        error: any;
        credentials: Credentials | false;
    }
> {
    subscriptions: { [key: string]: Subscription } = {};

    constructor(props: any) {
        super(props);
        // if the credentials are not set, set them to false just to be sure
        if (!getCredentials()) setCredentials(false);
        // bind the functions to this
        this.showError = this.showError.bind(this);
        this.removeError = this.removeError.bind(this);
        this.handleCredentialsChange = this.handleCredentialsChange.bind(this);
        // set the initial state
        this.state = {
            error: false,
            popups: {},
            credentials: getCredentials(),
        };
    }

    componentDidMount(): void {
        this.setState({ credentials: getCredentials() });
        // subscribe to credential changes
        this.subscriptions.credentials = credentialChange.subscribe(
            this.handleCredentialsChange
        );
        // subscribe to error events
        this.subscriptions.error = errorSubject.subscribe({
            next: this.showError,
        });
        this.subscriptions.errorResolve = errorResolveSubject.subscribe({
            next: this.removeError,
        });
    }
    componentWillUnmount(): void {
        // unsubscribe from error events
        if (this.subscriptions.error) this.subscriptions.error.unsubscribe();
        if (this.subscriptions.errorResolve)
            this.subscriptions.errorResolve.unsubscribe();
        if (this.subscriptions.credentials)
            this.subscriptions.credentials.unsubscribe();
    }
    handleCredentialsChange() {
        this.setState({ credentials: getCredentials() });
    }
    /**
     * adds a new error to the state which will be rendered as <Popup />[]
     * @param value the content of the error, E.g "Failed to make move: it is not your turn"
     */
    showError(value: any): void {
        // generate a time key to identify the error
        let key = new Date().getTime();
        // add the error to the state
        console.log("showing Error:", { key, value });
        // push the error to the states popups
        this.setState((prevState) => {
            // copy the state to a new state
            let newState = { ...prevState };
            // add the error to the state
            newState.popups[key] = value;
            console.log("newState:", newState);
            // return the new state
            return newState;
        });
    }
    /**
     * removes an error from the state causing the <Popup /> to be removed
     * @param key the key of the error passed to the <Popup /> as popupId
     */
    removeError(key: any): void {
        console.log("removing Error:", key);
        // remove the error from the states popups
        this.setState((prevState) => {
            // copy the state to a new state
            let newState = { ...prevState };
            // remove the error from the state
            delete newState.popups[key];
            console.log("newState:", newState);
            // return the new state
            return newState;
        });
    }

    render(): React.ReactNode {
        return (
            <Router basename="/">
                <div className="App">
                    {/* render the header */}
                    <Header />
                    <main>
                        {/* render the home link */}
                        <HomeLink />
                        {/* secondary elements */}
                        <>
                            <Routes>
                                {/* render the user's stats */}
                                <Route
                                    path="/users/:username"
                                    element={<UserInfo.UserStats />}
                                />
                                {/* overwrite the game route to render nothing */}
                                <Route path="/games/new" element={null} />
                                <Route path="/games/join" element={null} />
                                {/* render the games properties */}
                                <Route
                                    path="/games/:gameId"
                                    element={<Game.GameStats />}
                                />
                                <Route path="*" element={null} />
                            </Routes>
                        </>
                        {/* primary elements */}
                        <Tile className="MainTile">
                            <Routes>
                                {/* render the home page */}
                                <Route path="/" element={<Home />} />
                                {/* render the competition information page */}
                                <Route
                                    path="/competition"
                                    element={<Competition />}
                                />
                                {/* render the competition join page if the user is not yet part of the competition */}
                                <Route
                                    path="/competition/join"
                                    element={
                                        this.state.credentials &&
                                        !this.state.credentials
                                            .inCompetition ? (
                                            <JoinCompetition />
                                        ) : (
                                            // redirect to the competition page if the user is already part of the competition
                                            <Navigate to="/competition" />
                                        )
                                    }
                                />
                                {/* render the login page if the user is not signed in */}
                                <Route
                                    path="/login"
                                    element={
                                        !this.state.credentials ? (
                                            <Login />
                                        ) : (
                                            <Navigate to="/" />
                                        )
                                    }
                                />
                                {/* render the signup page if the user is not signed in */}
                                <Route
                                    path="/signup"
                                    element={
                                        !this.state.credentials ? (
                                            <SignUp />
                                        ) : (
                                            <Navigate to="/" />
                                        )
                                    }
                                />
                                {/* render the user list */}
                                <Route
                                    path="/users/"
                                    element={<UserOverview />}
                                />
                                {/* render the game list */}
                                <Route
                                    path="/games/"
                                    element={<GameOverview />}
                                />
                                {/* render the new game page */}
                                <Route
                                    path="/games/new"
                                    element={<NewGame />}
                                />
                                {/* render the join game page */}
                                <Route
                                    path="/games/join"
                                    element={<JoinGame />}
                                />
                                {/* render the game page */}
                                <Route
                                    path="/games/:gameId"
                                    element={<Game />}
                                />
                                {/* render the user page */}
                                <Route
                                    path="/users/:username"
                                    element={<UserInfo />}
                                />
                                {/* render the 404 page */}
                                <Route path="*" element={<Error404 />} />
                            </Routes>
                        </Tile>
                    </main>
                    <Footer></Footer>
                    {/* render the popups */}
                    {Object.keys(this.state.popups).map((key) => (
                        <Popup
                            value={this.state.popups[key]}
                            key={key}
                            popupId={key}
                        />
                    ))}
                </div>
            </Router>
        );
    }
}

export default App;
