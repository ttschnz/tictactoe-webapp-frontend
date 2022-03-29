import React, { SyntheticEvent } from "react";
import FlexContainer from "../FlexContainer";
import Heading from "../Heading";
import Space from "../Space";
import Tile from "../Tile";
import MaterialIcon from "../MaterialIcon";
import "./NewGame.css";
/**
 * A component that displays a form for creating a new game.
 * @component
 * @hideconstructor
 */
class NewGame extends React.Component {
    constructor(props: {}) {
        super(props);
        // bind functions to this
        this.handleClick = this.handleClick.bind(this);
    }

    render(): React.ReactNode {
        // return the component with the options for the game
        return (
            <FlexContainer direction="column" gap={10}>
                <FlexContainer direction="column" gap={10}>
                    <Space height={10} />
                    <Heading level={1}>Select Opponent</Heading>
                </FlexContainer>
                <Space height={20} />
                <FlexContainer direction="row" verticalCenter horizontalCenter>
                    {/* create a tile for each opponent */}
                    {this.options()}
                </FlexContainer>
            </FlexContainer>
        );
    }
    options(): React.ReactNode[] {
        // create a tile for each opponent
        return [
            // play against the computer
            <Tile
                className="NewGame-OptionTile"
                onClick={this.handleClick}
                key="playBot"
                data-option="playBot"
            >
                <FlexContainer
                    direction="row"
                    verticalCenter
                    horizontalCenter
                    className="NewGame-OptionTile-Content"
                >
                    <MaterialIcon name="precision_manufacturing" />
                    <span>Bot</span>
                </FlexContainer>
            </Tile>,
            // play against another player
            <Tile
                className="NewGame-OptionTile"
                onClick={this.handleClick}
                key="playPerson"
                data-option="playPerson"
            >
                <FlexContainer
                    direction="row"
                    verticalCenter
                    horizontalCenter
                    className="NewGame-OptionTile-Content"
                >
                    <MaterialIcon name="person" />
                    <span>Human</span>
                </FlexContainer>
            </Tile>,
        ];
    }
    // handle the click event when an option is selected
    handleClick(e: SyntheticEvent) {
        e.preventDefault();
        // get the option that was selected
        let option = (e.currentTarget as HTMLElement).dataset.option as
            | "playBot"
            | "playPerson";
        // emit the option to the parent component
        if (option === "playBot") {
            // play against the computer
            // TODO: implement
            console.log("playBot");
        } else if (option === "playPerson") {
            // play against another player
            // TODO: implement
            console.log("playPerson");
        }
    }
}
export default NewGame;
