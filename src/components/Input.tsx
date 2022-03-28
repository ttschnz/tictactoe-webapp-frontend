import React from "react";
import "./Input.css";
class Input extends React.Component<{
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    autoComplete?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}> {
    render(): React.ReactNode {
        return (
            <div className="labeled input">
                <input
                    name={this.props.name}
                    type={this.props.type ?? "text"}
                    placeholder={this.props.label}
                    required={this.props.required}
                    autoComplete={this.props.autoComplete}
                    onChange={this.props.onChange}
                />
                <label htmlFor={this.props.name}>{this.props.label}</label>
            </div>
        );
    }
}
export default Input;
