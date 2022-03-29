import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { api } from "../../api/apiService";
import { addGameKey, getCredentials } from "../../api/credentials";
import { gameIdFromHex } from "../../utils/gameUtils";
import Form from "../Form";
/**
 * A component that displays a form for joining a game.
 * @component
 * @hideconstructor
 */
class JoinGame extends React.Component<{ navigation: NavigateFunction }> {
    constructor(props: any) {
        super(props);
        this.joinGame = this.joinGame.bind(this);
    }
    joinGame(values: { [key: string]: string }): Promise<string | null> {
        return new Promise(async (resolve, _reject) => {
            let response = await api(
                "joinGame",
                {
                    gameId: values.gameId,
                },
                true
            );
            if (response.success) {
                // add the game key to the local storage
                if (response.data.gameKey)
                    addGameKey(
                        response.data.gameKey,
                        gameIdFromHex(response.data.gameId)
                    );
                else if (!getCredentials()) {
                    // if the game key is not returned, and the user is not logged in, the join failed
                    return resolve("failed to join game");
                }
                // resolve to have no error
                resolve(null);
                // navigate to the game
                this.props.navigation(`/games/${response.data.gameId}`);
            } else {
                return resolve("failed to join game");
            }
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

function _JoinGame(props: {}) {
    const navigation = useNavigate();
    return <JoinGame navigation={navigation} {...props} />;
}
export default _JoinGame;
