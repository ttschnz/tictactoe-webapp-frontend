import classNames from "classnames";
import React from "react";
import "./Loading.css";
/**
 * A component that can be used to display a loading animation.
 * @component
 * @hideconstructor
 */
class Loading extends React.Component {
    render(): React.ReactNode {
        // the loading animation is handled by CSS
        return <div className="Loading" />;
    }
}
/**
 * A component that can be used to display a loading animation for text values.
 * @component
 * @hideconstructor
 */
class LoadingValue extends React.Component<{ className?: string }, {}> {
    render(): React.ReactNode {
        return (
            <span
                // the loading animation is handled by CSS
                className={classNames("LoadingValue", this.props.className)}
            />
        );
    }
}
export { LoadingValue };
export default Loading;
