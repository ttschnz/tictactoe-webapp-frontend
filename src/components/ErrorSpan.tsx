import React from "react";
import "./ErrorSpan.css";
/**
 * A component that displays an error message as a span.
 * @component
 * @hideconstructor
 */
class ErrorSpan extends React.Component<{}, {}> {
    render(): React.ReactNode {
        // return the error message as a span
        return <span className="ErrorSpan">{this.props.children}</span>;
    }
}
export default ErrorSpan;
