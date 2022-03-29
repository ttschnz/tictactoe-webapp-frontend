import React, { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import "./MaterialIconButton.css";

/**
 * A component that can be used to display a circular button with a material icon.
 */
class MaterialIconButton extends React.Component<
    {
        name: string;
        action?: MouseEventHandler<HTMLButtonElement> | string;
    },
    {}
> {
    render(): React.ReactNode {
        // if the action is a string, it is a link
        if (typeof this.props.action === "string")
            return (
                // the link
                <Link
                    to={this.props.action}
                    className="MaterialIconButton-LinkContainer"
                >
                    {/* the button */}
                    <button className="MaterialIconButton material-icons">
                        {this.props.name}
                    </button>
                </Link>
            );
        // otherwise, it is a function
        else
            return (
                // the button
                <button
                    className="MaterialIconButton material-icons"
                    onClick={this.props.action}
                >
                    {this.props.name}
                </button>
            );
    }
}
export default MaterialIconButton;
