import React from "react";
import "./ErrorSpan.css";
class ErrorSpan extends React.Component<{}, {}> {
    render(): React.ReactNode {
        return <span className="ErrorSpan">{this.props.children}</span>;
    }
}
export default ErrorSpan;
