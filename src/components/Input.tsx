import React from "react";
import "./Input.css";
/**
 * A input component that can be used to display an input.
 * @component
 * @hideconstructor
 */
class Input extends React.Component<{
    /**
     * The label of the input.
     */
    label: string;
    /**
     * The name of the input.
     */
    name: string;
    /**
     * The type of the input.
     */
    type?: string;
    /**
     * Whether the input is required.
     */
    required?: boolean;
    /**
     * Whether autocomplete should be enabled.
     */
    autoComplete?: string;
    /**
     * What the input should do when the value changes.
     */
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
