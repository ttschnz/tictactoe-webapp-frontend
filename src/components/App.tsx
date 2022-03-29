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
import Error404 from "./routes/Error404";
import HomeLink from "./HomeLink";
import Tile from "./Tile";

import { getCredentials, setCredentials } from "../api/credentials";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { errorResolveSubject, errorSubject } from "../utils/subjects";
import Popup from "./Popup";
import { Subscription } from "rxjs";

/**
 * The main application component.
 * @component
 * @hideconstructor
 */
class App extends React.Component<
    {},
    { popups: { [key: string]: string }; error: any }
> {
    subscriptions: { [key: string]: Subscription } = {};

    constructor(props: any) {
        super(props);
        // if the credentials are not set, set them to false just to be sure
        if (!getCredentials()) setCredentials(false);
        // bind the functions to this
        this.showError = this.showError.bind(this);
        this.removeError = this.removeError.bind(this);
        // set the initial state
        this.state = {
            error: false,
            popups: {},
        };
    }

    componentDidMount(): void {
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
                                {/* render the login page */}
                                <Route path="/login" element={<Login />} />
                                {/* render the signup page */}
                                <Route path="/signup" element={<SignUp />} />
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
