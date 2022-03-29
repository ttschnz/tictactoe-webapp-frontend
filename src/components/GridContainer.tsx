import React from "react";
import "./GridContainer.css";
import classNames from "classnames";
class GridContainer extends React.Component<
    {
        template: { row?: string; column?: string };
        className?: string;
        gap?: number;
    },
    {}
> {
    // the gap between the tiles
    standartGap = 20;
    render(): React.ReactNode {
        // add the className to the grid container
        let className = classNames({
            GridContainer: true,
            ...(this.props.className ? { [this.props.className]: true } : {}),
        });
        // return the grid container
        return (
            <div className={className} style={this.getStyle()}>
                {this.props.children}
            </div>
        );
    }
    // get the style of the grid container
    getStyle(): React.CSSProperties {
        let styles = {
            "grid-template-rows": this.props.template.row ?? "",
            "grid-template-columns": this.props.template.column ?? "",
            gap: `${this.props.gap ?? this.standartGap}px`,
        };
        return styles as React.CSSProperties;
    }
}
export default GridContainer;
