import React from "react";
import { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import "./Button.css";
/**
 * A button component that can be used to navigate to a different page or perform an action.
 * @component
 * @hideconstructor
 * @example
 * <Button
 *    className="my-button"
 *   onClick={() => console.log("clicked")}
 *  > Click me! </Button>
 * @example
 * <Button
 *   primary
 *   className="my-button"
 *  onClick="/game/1"
 * > Go to game #1 </Button>
 */
class Button extends React.Component<
    {
        action?: MouseEventHandler<HTMLButtonElement> | string;
        primary?: boolean;
    },
    {}
> {
    render(): React.ReactNode {
        // get the class names
        let buttonClass = classNames({
            Button: true,
            "Button-Primary": this.props.primary,
        });
        // if the action is a string, create a link around the button
        if (typeof this.props.action === "string") {
            return (
                <Link to={this.props.action} className="Button-LinkContainer">
                    <button className={buttonClass}>
                        {this.props.children}
                    </button>
                </Link>
            );
        }
        // if the action is a function, create a button with the action as onClick
        else
            return (
                <button className={buttonClass} onClick={this.props.action}>
                    {this.props.children}
                </button>
            );
    }
}

export default Button;
