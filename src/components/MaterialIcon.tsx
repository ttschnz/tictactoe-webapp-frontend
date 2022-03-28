import React from "react";

import "./MaterialIcon.css";
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
