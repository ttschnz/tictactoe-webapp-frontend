import React from "react";
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
class Popup extends React.Component<{ value: any; popupId: any }, {}> {
    constructor(props: any) {
        super(props);
        // bind the resolve function to the component
        this.resolve = this.resolve.bind(this);
    }
    resolve() {
        // resolve the error
        errorResolveSubject.next(this.props.popupId);
    }
    render(): React.ReactNode {
        if (this.props.value)
            // if the value is defined, display it
            return (
                <FlexContainer
                    direction="row"
                    verticalCenter
                    horizontalCenter
                    className="Popup"
                >
                    <Tile>
                        {/* the heading */}
                        <Heading level={2}>Error</Heading>
                        {/* the close button */}
                        <MaterialIconButton
                            name="close"
                            action={this.resolve}
                        />
                        {/* the error message */}
                        <span>{this.props.value}</span>
                    </Tile>
                </FlexContainer>
            );
        else return null;
    }
}
export default Popup;
