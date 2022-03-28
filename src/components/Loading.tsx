import classNames from "classnames";
import React from "react";
import "./Loading.css";
class Loading extends React.Component {
    render(): React.ReactNode {
        return <div className="Loading" />;
    }
}
class LoadingValue extends React.Component<{ className?: string }, {}> {
    render(): React.ReactNode {
        return (
            <span
                className={classNames({
                    LoadingValue: true,
                    [this.props.className ?? ""]: true,
                })}
            />
        );
    }
}
export { LoadingValue };
export default Loading;
