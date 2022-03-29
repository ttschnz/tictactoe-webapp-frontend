import React from "react";
import MaterialIcon from "./MaterialIcon";
import "./InfoTile.css";
class InfoTile extends React.Component<{ content: string }> {
    render(): React.ReactNode {
        return (
            <div className="InfoTile">
                <MaterialIcon name="info" />
                <div>
                    <span>{this.props.content}</span>
                </div>
            </div>
        );
    }
}

export default InfoTile;
