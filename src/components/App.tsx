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
class App extends React.Component<
    {},
    { popups: { [key: string]: string }; error: any }
> {
    subscriptions: { [key: string]: Subscription } = {};

    constructor(props: any) {
        super(props);
        if (!getCredentials()) setCredentials(false);
        this.showError = this.showError.bind(this);
        this.removeError = this.removeError.bind(this);
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
        let key = new Date().getTime();
        console.log("showing Error:", { key, value });
        this.setState((prevState) => {
            let newState = { ...prevState };
            newState.popups[key] = value;
            console.log("newState:", newState);
            return newState;
        });
    }
    /**
     * removes an error from the state causing the <Popup /> to be removed
     * @param key the key of the error passed to the <Popup /> as popupId
     */
    removeError(key: any): void {
        console.log("removing Error:", key);
        this.setState((prevState) => {
            let newState = { ...prevState };
            delete newState.popups[key];
            console.log("newState:", newState);
            return newState;
        });
    }

    render(): React.ReactNode {
        return (
            <Router basename="/">
                <div className="App">
                    <Header />
                    <main>
                        <HomeLink />
                        <Routes>
                            <Route
                                path="/users/:username"
                                element={<UserInfo.UserStats />}
                            />
                            <Route path="/games/new" element={null} />
                            <Route
                                path="/games/:gameId"
                                element={<Game.GameStats />}
                            />
                            <Route path="*" element={null} />
                        </Routes>
                        <Tile className="MainTile">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<SignUp />} />
                                <Route
                                    path="/users/"
                                    element={<UserOverview />}
                                />
                                <Route
                                    path="/games/"
                                    element={<GameOverview />}
                                />
                                <Route
                                    path="/games/new"
                                    element={<NewGame />}
                                />
                                <Route
                                    path="/games/:gameId"
                                    element={<Game />}
                                />
                                <Route
                                    path="/users/:username"
                                    element={<UserInfo />}
                                />
                                <Route path="*" element={<Error404 />} />
                            </Routes>
                        </Tile>
                    </main>
                    <Footer></Footer>
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
