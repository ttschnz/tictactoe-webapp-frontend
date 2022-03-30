import classNames from "classnames";
import React, { SyntheticEvent } from "react";
import { errorResolveSubject } from "../utils/subjects";
import FlexContainer from "./FlexContainer";
import Heading from "./Heading";
import MaterialIconButton from "./MaterialIconButton";
import "./Popup.css";
import Tile from "./Tile";

/**
 * A component that can be used to display a popup.
 * TODO: style it with CSS and make it responsive
 */
class Popup extends React.Component<
    { value: any; popupId: any },
    { hidden: boolean }
> {
    constructor(props: any) {
        super(props);
        // bind the resolve function to the component
        this.resolve = this.resolve.bind(this);
        this.state = {
            hidden: true,
        };
    }
    componentDidMount() {
        // show the popup after a delay to have a nice animation
        setTimeout(() => {
            this.setState({ hidden: false });
        }, 20);
    }
    resolve(e: SyntheticEvent) {
        // if the target is the closeButton or the container around the popup, resolve the error
        if (e.target === e.currentTarget) {
            errorResolveSubject.next(this.props.popupId);
        }
    }
    render(): React.ReactNode {
        if (this.props.value)
            // if the value is defined, display it
            return (
                <FlexContainer
                    direction="row"
                    verticalCenter
                    horizontalCenter
                    className={classNames("Popup", {
                        "Popup-Hidden": this.state.hidden,
                    })}
                    onClick={this.resolve}
                >
                    <Tile
                        className={classNames("Popup-Tile", {
                            "Popup-Tile-Hidden": this.state.hidden,
                        })}
                    >
                        {/* the heading */}
                        <Heading level={2}>Error</Heading>
                        {/* the close button */}
                        <MaterialIconButton
                            name="close"
                            action={this.resolve}
                        />
                        {/* the error message */}
                        <span className="Popup-Message">
                            {this.props.value}
                        </span>
                    </Tile>
                </FlexContainer>
            );
        else return null;
    }
}
export default Popup;
