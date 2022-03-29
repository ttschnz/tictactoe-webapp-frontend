import React from "react";
import "./LabeledDivider.css";
/**
 * A component that can be used to display a divider with a label.
 */
class LabeledDivider extends React.Component<{ label: string }, {}> {
    render(): React.ReactNode {
        return (
            // the divider
            <hr className="LabeledDivider" data-label={this.props.label}></hr>
        );
    }
}
export default LabeledDivider;
