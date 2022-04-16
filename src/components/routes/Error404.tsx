import React from "react";
import jsUtils from "../../utils/jsUtils";
/**
 * A component that renders a 404 page.
 * @component
 * @hideconstructor
 */
class Error404 extends React.Component {
    componentDidMount() {
        jsUtils.changeTitle("ERROR 404");
    }
    render(): React.ReactNode {
        return (
            <div>
                <span>ERROR: NOT FOUND</span>
            </div>
        );
    }
}
export default Error404;
