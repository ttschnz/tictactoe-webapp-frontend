import React from "react";
import { Link } from "react-router-dom";
import { GameMetaData } from "../utils/types";
import { LoadingValue } from "./Loading";
import "./UserSpan.css";
class UserSpan extends React.Component<
    {
        username:
            | GameMetaData["players"]["attacker"]
            | GameMetaData["players"]["defender"];
    },
    {}
> {
    render(): React.ReactNode {
        if (this.props.username)
            return (
                <Link to={`/users/@${this.props.username}`}>
                    <span className="UserSpan">@{this.props.username}</span>
                </Link>
            );
        else if (this.props.username === undefined)
            return <LoadingValue className="UserSpan UserSpan-Loading" />;
        else return <span className="UserSpan UserSpan-GuestUser">Guest</span>;
    }
}

export default UserSpan;
