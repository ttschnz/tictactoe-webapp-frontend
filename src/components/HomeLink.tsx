import React from "react";
import FlexContainer from "./FlexContainer";
import { Link } from "react-router-dom";
import MaterialIconButton from "./MaterialIconButton";
import { Subscription } from "rxjs";
import "./HomeLink.css";
import { locationChange, scroll } from "../utils/subjects";
import classNames from "classnames";

/**
 * A home link component that can be used to display the parts of the link.
 * @component
 * @hideconstructor
 */
class HomeLink extends React.Component<{}, { url: string; top: number }> {
    // the subscription to the location change subject and the scroll subject
    subscriptions: { [key: string]: Subscription } = {};
    constructor(props: any) {
        super(props);
        // get the current url and the current scroll position
        this.state = { url: document.location.pathname, top: 0 };
        // bind the functions to this
        this.locationChange = this.locationChange.bind(this);
        this.scrolled = this.scrolled.bind(this);
    }

    /**
     * respond to changes on the path to properly render the HomeLink with all its LinkParts
     * @param newPathName
     */
    locationChange(newPathName: any): void {
        // update the state with the new url
        this.setState({ url: newPathName });
    }
    // respond to changes on the scroll position to properly render the HomeLink with all its LinkParts
    scrolled(arg: any) {
        // update the state with the new scroll position
        if (document.scrollingElement) {
            // get the current scroll position
            this.setState({ top: document.scrollingElement.scrollTop });
        } else {
            this.setState({ top: 0 });
        }
    }

    // subscribe to the location change and scroll change subjects
    componentDidMount() {
        // subscribe to location changes
        this.subscriptions.locationChange = locationChange.subscribe({
            next: this.locationChange,
        });
        // subscribe to scroll events
        this.subscriptions.scroll = scroll.subscribe({
            next: this.scrolled,
        });
    }
    // unsubscribe from all subscriptions
    componentWillUnmount() {
        // unsubscribe from location changes
        if (this.subscriptions.locationChange)
            this.subscriptions.locationChange.unsubscribe();
        // unsubscribe from scroll events
        if (this.subscriptions.scroll) this.subscriptions.scroll.unsubscribe();
    }
    render(): React.ReactNode {
        // get the class names for the home link
        let className = classNames({
            HomeLink: true,
            fixed: this.state.top >= 0,
        });
        return (
            // render the home link
            <div className={className} style={this.getStyle()}>
                <FlexContainer direction="row" gap={5} verticalCenter>
                    {/* home button */}
                    <MaterialIconButton name="home" action="/" />
                    {/* render the link parts */}
                    {this.getLinkParts()}
                </FlexContainer>
            </div>
        );
    }
    // get the style for the home link
    getStyle(): React.CSSProperties {
        let styles = {
            "--top": this.state.top,
        };
        return styles as React.CSSProperties;
    }
    /**
     *
     * @returns all parts of the current path but home with links
     */
    getLinkParts(): JSX.Element[] {
        return (
            this.state.url
                // split the path by "/"
                .split("/")
                // filter out all empty values
                .filter((linkPart) => linkPart !== "")
                // create an instance for each part of the path
                .map((linkPart, indexOfLinkPart, allLinkParts) => {
                    // the target for the link should be all parts of the array until the index is the same as indexOfLinkPart
                    const target = allLinkParts
                        .filter(
                            (_value, comparingIndex) =>
                                indexOfLinkPart >= comparingIndex
                        )
                        .join("/");
                    return (
                        <FlexContainer
                            direction="row"
                            key={target}
                            gap={5}
                            verticalCenter
                        >
                            <span>/</span>
                            <Link to={"/" + target}>{linkPart}</Link>
                        </FlexContainer>
                    );
                })
        );
    }
}

export default HomeLink;
