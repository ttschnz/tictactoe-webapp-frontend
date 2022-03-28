import "./Tile.css";
import React from "react";
import classNames from "classnames";
import { locationChange } from "../utils/subjects";
import { Subscription } from "rxjs";
/**
 * A component that renders a tile with content.
 * @component
 * @hideconstructor
 */
class Tile extends React.Component<
    { className?: string; [key: string]: any },
    { pathName: string }
> {
    subscriptions: { [key: string]: Subscription } = {};
    constructor(props: { className?: string }) {
        super(props);
        // initialize the pathname with the current location
        this.state = { pathName: document.location.pathname };
        // bind the locationChange method to this
        this.locationChange = this.locationChange.bind(this);
    }
    locationChange() {
        // update the pathname when the location changes
        this.setState({ pathName: document.location.pathname });
    }
    componentDidMount() {
        // subscribe to location changes to update the pathname
        this.subscriptions.locationChange = locationChange.subscribe({
            next: this.locationChange,
        });
    }
    componentWillUnmount() {
        // unsubscribe from location changes
        if (this.subscriptions.locationChange)
            this.subscriptions.locationChange.unsubscribe();
    }
    render(): React.ReactNode {
        return (
            <div
                {...this.props}
                data-path={this.state.pathName}
                className={classNames({
                    Tile: true,
                    ...(this.props.className
                        ? { [this.props.className]: true }
                        : {}),
                })}
            >
                {this.props.children}
            </div>
        );
    }
}
export default Tile;
