import React, { MouseEventHandler } from "react";
import { Link } from "react-router-dom";

import "./MaterialIconButton.css";
class MaterialIconButton extends React.Component<
    {
        name: string;
        action?: MouseEventHandler<HTMLButtonElement> | string;
    },
    {}
> {
    render(): React.ReactNode {
        if (typeof this.props.action === "string")
            return (
                <Link
                    to={this.props.action}
                    className="MaterialIconButton-LinkContainer"
                >
                    <button className="MaterialIconButton material-icons">
                        {this.props.name}
                    </button>
                </Link>
            );
        else
            return (
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
