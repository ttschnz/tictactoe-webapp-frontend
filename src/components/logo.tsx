import React from "react";
import logo from "./logo.svg";
import "./Logo.css";
import { Link } from "react-router-dom";

/**
 * A component that can be used to display a logo.
 */
class Logo extends React.Component {
    render(): React.ReactNode {
        return (
            // go to the home page when the logo is clicked
            <Link to="/">
                <div className="Logo">
                    {/* the logo */}
                    <img src={logo} alt="logo"></img>
                </div>
            </Link>
        );
    }
}
export default Logo;
