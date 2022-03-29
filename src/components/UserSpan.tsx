import React from "react";
import { Link } from "react-router-dom";
import { GameMetaData } from "../utils/types";
import { LoadingValue } from "./Loading";
import "./UserSpan.css";
/**
 * A component that can be used to display a username and a link to the user's profile.
 * If the username undefined, it will display a loading animation.
 * If the username is null, it will display "Guest" without a link.
 */
class UserSpan extends React.Component<
    {
        username?:
            | GameMetaData["players"]["attacker"]
            | GameMetaData["players"]["defender"]
            | null;
    },
    {}
> {
    render(): React.ReactNode {
        // if the username is set, display it
        if (this.props.username)
            return (
                <Link to={`/users/@${this.props.username}`}>
                    <span className="UserSpan">@{this.props.username}</span>
                </Link>
            );
        // if the username is undefined, display a loading animation
        else if (this.props.username === undefined)
            return <LoadingValue className="UserSpan UserSpan-Loading" />;
        // if the username is null, display "Guest"
        else return <span className="UserSpan UserSpan-GuestUser">Guest</span>;
    }
}

export default UserSpan;
