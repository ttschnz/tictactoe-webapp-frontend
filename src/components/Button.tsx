import React from "react";
import { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import "./Button.css";
class Button extends React.Component<
    {
        action?: MouseEventHandler<HTMLButtonElement> | string;
        primary?: boolean;
    },
    {}
> {
    render(): React.ReactNode {
        let buttonClass = classNames({
            Button: true,
            "Button-Primary": this.props.primary,
        });
        if (typeof this.props.action === "string") {
            return (
                <Link to={this.props.action} className="Button-LinkContainer">
                    <button className={buttonClass}>
                        {this.props.children}
                    </button>
                </Link>
            );
        } else
            return (
                <button className={buttonClass} onClick={this.props.action}>
                    {this.props.children}
                </button>
            );
    }
}

export default Button;
