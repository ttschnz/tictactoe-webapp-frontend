import React from "react";
import "./FlexContainer.css";
import classNames from "classnames";
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
    defaultGap = 20;
    render(): React.ReactNode {
        const flexClass = classNames({
            FlexContainer: true,
            "FlexContainer-Row": this.props.direction === "row",
            "FlexContainer-Column": this.props.direction !== "row",
            "FlexContainer-NoWrap": this.props.nowrap,
            "FlexContainer-Centered-Vertically":
                this.props.verticalCenter === true,
            "FlexContainer-Centered-Horizontally":
                this.props.horizontalCenter === true,
            ...(this.props.className ? { [this.props.className]: true } : {}),
        });
        let passingProps = { ...this.props };
        delete passingProps["className"];
        delete passingProps["verticalCenter"];
        delete passingProps["horizontalCenter"];
        delete passingProps["nowrap"];
        delete passingProps["gap"];
        return (
            <div
                {...passingProps}
                className={flexClass}
                style={this.getStyle()}
            >
                {this.props.children}
            </div>
        );
    }
    getStyle(): React.CSSProperties {
        return {
            gap: `${this.props.gap ?? this.defaultGap}px`,
            ...this.props.style,
        };
    }
}
export default FlexContainer;
