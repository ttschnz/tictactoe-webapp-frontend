import React from "react";
import "./LabeledDivider.css";
class LabeledDivider extends React.Component<{ label: string }, {}> {
    render(): React.ReactNode {
        return (
            <hr className="LabeledDivider" data-label={this.props.label}></hr>
        );
    }
}
export default LabeledDivider;
