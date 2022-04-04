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
export type JSONResponse<T = any> = {
    success: boolean;
    data?: T;
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
    attacker: string | null | undefined;
    defender: string | null | undefined;
    gameField: Array<-1 | 0 | 1>;
    gameId: number;
    isDraw?: boolean;
    isFinished?: boolean;
    winner: string | null | false;
}
export interface Players {
    attacker: string | null | undefined;
    defender: string | null | undefined;
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
