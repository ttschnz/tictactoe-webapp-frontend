import React from "react";
import "./Tiny.css";
class Tiny extends React.Component {
    render() {
        return <span className="Tiny">{this.props.children}</span>;
    }
}
export default Tiny;
