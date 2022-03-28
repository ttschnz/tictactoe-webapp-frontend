import React from "react";

class Space extends React.Component<{ height?: number; width?: number }> {
    render(): React.ReactNode {
        return <div style={this.getStyles()}></div>;
    }
    getStyles(): React.CSSProperties {
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
