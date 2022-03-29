import React from "react";
import "./MaterialIcon.css";

/**
 * A component that can be used to display a material icon.
 * see https://material.io/resources/icons/?style=baseline for the list of icons
 */
class MaterialIcon extends React.Component<
    {
        name: string;
    },
    {}
> {
    render(): React.ReactNode {
        return (
            <span className="material-icons MaterialIcon">
                {this.props.name}
            </span>
        );
    }
}
export default MaterialIcon;
