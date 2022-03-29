/**
 * File containing all general types used in the application.
 */

// Credentials used to authenticate the user.
export type Credentials = {
    username: string;
    token: string;
    tokenExpiration: number;
    inCompetition: boolean;
};

// A response from the servers API.
export type JSONResponse = {
    success: boolean;
    data?: any;
    error?: any;
};

// websocket listener
export type listener = {
    resolve: Function;
    reject: Function;
};

// websocket message listener
export type messageListener = {
    [key: string]: listener;
};

// websocket message extends the servers API response and adds an action and an id to identify the request
export type SocketResponse = JSONResponse & {
    action: string;
    msgId: string;
};

// Datatype used to represent a users games.
export interface PostGameInfo {
    attacker: string;
    defender: string;
    gameField: Array<-1 | 0 | 1>;
    gameId: number;
    isDraw: boolean;
    isFinished: boolean;
    winner: string | null | false;
}

// Datatype used to store the game's data, which is received from the server by requesting the game's data.
export interface GameMetaData {
    players: {
        attacker?: string | null;
        defender?: string;
    };
    gameState: {
        finished?: boolean;
        winner?: string | null;
        isDraw?: boolean;
    };
    moves: Move[];
}
// Position where a move can be placed
export type PositionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

// Datatype used to represent a move.
export interface Move {
    gameId: string;
    moveIndex: number;
    movePosition: PositionIndex;
    player: string;
}
