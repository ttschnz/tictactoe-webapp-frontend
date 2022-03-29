import React from "react";
import "./FlexContainer.css";
import classNames from "classnames";
/**
 * A component that displays a container with display: flex.
 * @component
 * @hideconstructor
 * @example
 * <FlexContainer
 *   className="my-flex-container"
 *   direction="column"
 *   gap={10}
 * > {content} </FlexContainer>
 *
 */
class FlexContainer extends React.Component<
    {
        direction: "row" | "column";
        verticalCenter?: boolean;
        horizontalCenter?: boolean;
        nowrap?: boolean;
        gap?: number;
        className?: string;
        style?: React.CSSProperties;
        [key: string]: any;
    },
    {}
> {
    // default gap is 20px
    defaultGap = 20;
    render(): React.ReactNode {
        // get the class names
        const flexClass = classNames({
            FlexContainer: true,
            // add the direction
            "FlexContainer-Row": this.props.direction === "row",
            "FlexContainer-Column": this.props.direction !== "row",
            // add the nowrap class
            "FlexContainer-NoWrap": this.props.nowrap,
            // add the vertical and horizontal center
            "FlexContainer-Centered-Vertically":
                this.props.verticalCenter === true,
            "FlexContainer-Centered-Horizontally":
                this.props.horizontalCenter === true,
            // add other classes from the className prop
            ...(this.props.className ? { [this.props.className]: true } : {}),
        });
        // get the unused props
        let passingProps = { ...this.props };
        delete passingProps["className"];
        delete passingProps["verticalCenter"];
        delete passingProps["horizontalCenter"];
        delete passingProps["nowrap"];
        delete passingProps["gap"];
        return (
            <div
                // pass the props to the div
                {...passingProps}
                // add the class names
                className={flexClass}
                // add the style
                style={this.getStyle()}
            >
                {this.props.children}
            </div>
        );
    }
    // get the style (currently only the gap size)
    getStyle(): React.CSSProperties {
        return {
            gap: `${this.props.gap ?? this.defaultGap}px`,
            ...this.props.style,
        };
    }
}
export default FlexContainer;
