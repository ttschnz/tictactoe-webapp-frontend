import classNames from "classnames";
import React from "react";
class Heading extends React.Component<
    { level: 1 | 2 | 3 | 4 | 5 | 6; className?: string },
    {}
> {
    render(): React.ReactNode {
        switch (this.props.level) {
            case 1:
                return (
                    <h1 className={this.props.className}>
                        {this.props.children}
                    </h1>
                );
            case 2:
                return (
                    <h2 className={this.props.className}>
                        {this.props.children}
                    </h2>
                );
            case 3:
                return (
                    <h3 className={this.props.className}>
                        {this.props.children}
                    </h3>
                );
            case 4:
                return (
                    <h4 className={this.props.className}>
                        {this.props.children}
                    </h4>
                );
            case 5:
                return (
                    <h5 className={this.props.className}>
                        {this.props.children}
                    </h5>
                );
            case 6:
                return (
                    <h6 className={this.props.className}>
                        {this.props.children}
                    </h6>
                );
        }
    }
}
class SubHeading extends React.Component<{ className?: string }> {
    render(): React.ReactNode {
        return (
            <span
                className={classNames({
                    SubHeading: true,
                    [this.props.className ?? ""]: true,
                })}
            >
                {this.props.children}
            </span>
        );
    }
}
export { SubHeading };
export default Heading;
