import classNames from "classnames";
import React from "react";
/**
 * A heading component that can be used to display a heading.
 * @component
 * @hideconstructor
 */
class Heading extends React.Component<{
    /**
     * The level of the heading.
     */
    level: 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * The class name of the heading.
     */
    className?: string;
}> {
    render() {
        return React.createElement(
            `h${this.props.level}`,
            {
                className: classNames(
                    "Heading",
                    `Heading${this.props.level}`,
                    this.props.className
                ),
            },
            this.props.children
        );
    }
}

/**
 * A subheading component that can be used to display a subheading.
 */
class SubHeading extends React.Component<{ className?: string }> {
    render(): React.ReactNode {
        return (
            <span className={classNames("SubHeading", this.props.className)}>
                {this.props.children}
            </span>
        );
    }
}
export { SubHeading };
export default Heading;
