import React, { SyntheticEvent } from "react";
import Button from "./Button";
import Heading from "./Heading";
import Input from "./Input";
import ErrorSpan from "./ErrorSpan";

class Form extends React.Component<
    {
        fields: {
            [key: string]: {
                label: string;
                type:
                    | "text"
                    | "number"
                    | "password"
                    | "email"
                    | "date"
                    | "time";
                autoComplete?: string;
                value?: string;
                required?: boolean;
            };
        };
        submit: {
            label: string;
        };
        heading: string;
    } & {
        onSubmit?: (values: {
            [key: string]: string;
        }) => Promise<string | null>;
    },
    {
        values: {
            [key: string]: string;
        };
        error: string | null;
    }
> {
    constructor(props: any) {
        super(props);
        this.state = {
            values: {},
            error: null,
        };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    // handle value changes in the form
    handleValueChange(e: SyntheticEvent) {
        // get the target element
        const target = e.target as HTMLInputElement;
        // get the value of the target element
        const value =
            target.type === "checkbox" ? String(target.checked) : target.value;
        // get the name of the input field
        const name = target.name;
        // update the state with the new value
        this.setState((currentState) => ({
            values: {
                ...currentState.values,
                [name]: value,
            },
        }));
    }
    async handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        if (this.props.onSubmit) {
            let error = await this.props.onSubmit(this.state.values);
            if (error)
                this.setState({
                    error,
                });
        }
    }

    render(): React.ReactNode {
        return (
            <form onSubmit={this.handleSubmit}>
                <Heading level={1} space={20}>
                    {this.props.heading}
                </Heading>
                {Object.keys(this.props.fields).map((key) => {
                    const field = this.props.fields[key];
                    return (
                        <div key={key}>
                            <Input
                                label={field.label}
                                name={key}
                                type={field.type}
                                required={field.required}
                                autoComplete={field.autoComplete}
                                onChange={this.handleValueChange}
                            />
                        </div>
                    );
                })}
                <Button primary>{this.props.submit.label}</Button>
                {this.state.error ? (
                    <ErrorSpan>{this.state.error}</ErrorSpan>
                ) : null}
            </form>
        );
    }
}
export default Form;
