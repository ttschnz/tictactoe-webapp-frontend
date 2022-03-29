import React from "react";
import Form from "../Form";
/**
 * A component that displays a form for joining a game.
 * @component
 * @hideconstructor
 */
class JoinGame extends React.Component {
    joinGame(values: { [key: string]: string }): Promise<string | null> {
        return new Promise((resolve, _reject) => {
            console.log(values);
            resolve(null);
        });
    }
    render(): React.ReactNode {
        return (
            <div>
                <Form
                    heading="Join Game"
                    submit={{
                        label: "Join",
                    }}
                    onSubmit={this.joinGame}
                    fields={{
                        gameId: {
                            label: "Game Id",
                            type: "text",
                            required: true,
                        },
                    }}
                />
            </div>
        );
    }
}
export default JoinGame;
