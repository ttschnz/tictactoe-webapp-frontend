import React from "react";

/**
 * A component that can be used to display a divider with a label.
 * @component
 * @hideconstructor
 */
class Space extends React.Component<{ height?: number; width?: number }> {
    render(): React.ReactNode {
        // the divider
        return <div style={this.getStyles()}></div>;
    }
    getStyles(): React.CSSProperties {
        // get the styles from the props height and width
        return {
            ...(this.props.height
                ? { height: `${this.props.height ?? 0}px` }
                : {}),
            ...(this.props.width
                ? { width: `${this.props.width ?? 0}px` }
                : {}),
        };
    }
}
export default Space;
