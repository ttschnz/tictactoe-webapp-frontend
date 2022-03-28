import React from "react";
import logo from "./logo.svg";
import "./Logo.css";
import { Link } from "react-router-dom";
// import { BrowserRouter } from "react-router-dom";

class Logo extends React.Component {
    render(): React.ReactNode {
        return (
            <Link to="/">
                <div className="Logo">
                    <img src={logo} alt="logo"></img>
                </div>
            </Link>
        );
    }
}
export default Logo;
