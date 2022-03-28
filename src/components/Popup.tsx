import React from "react";
import { errorResolveSubject } from "../utils/subjects";
import FlexContainer from "./FlexContainer";
import Heading from "./Heading";
import MaterialIconButton from "./MaterialIconButton";
import "./Popup.css";
import Tile from "./Tile";
class Popup extends React.Component<{ value: any; popupId: any }, {}> {
    constructor(props: any) {
        super(props);
        this.resolve = this.resolve.bind(this);
    }
    componentDidMount() {
        console.log("showing popup", this.props.value);
    }
    resolve() {
        errorResolveSubject.next(this.props.popupId);
    }
    render(): React.ReactNode {
        if (this.props.value)
            return (
                <FlexContainer
                    direction="row"
                    verticalCenter
                    horizontalCenter
                    className="Popup"
                >
                    <Tile>
                        <Heading level={2}>Error</Heading>
                        <MaterialIconButton
                            name="close"
                            action={this.resolve}
                        />
                        <span>{this.props.value}</span>
                    </Tile>
                </FlexContainer>
            );
        else return null;
    }
}
export default Popup;
