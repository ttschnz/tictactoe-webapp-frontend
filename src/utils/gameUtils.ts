import WebSocketConnection, { api } from "../api/apiService";
import { getCredentials, getGameKey } from "../api/credentials";
import { gameChange } from "./subjects";
import { Move, PostGameInfo, SocketResponse, Players } from "./types";
import { setMany, get, values, update } from "idb-keyval";

// transform a gameId number to a hexadecimal string
export function gameIdToHex(gameId: number): string {
    return gameId.toString(16);
}

// transform a hexadecimal string to a gameId number
export function gameIdFromHex(gameId: string): number {
    return Number(`0x${gameId}`);
}

// figure out whether a user is the attacker or the defender
export function evaluatePlayer(
    player: Move["player"],
    players: Players
): PostGameInfo["gameField"][0] {
    if (player === undefined) {
        return 0;
    } else if (player === players.attacker) {
        return 1;
    } else {
        return -1;
    }
}

// parse moves to a game field
export function parseMoves(
    moves: Move[],
    players: Players
): PostGameInfo["gameField"] {
    console.log("parsing moves", moves, players);
    // create an empty game field
    let gameField: PostGameInfo["gameField"] = Array(9).fill(0);
    // iterate over all moves
    for (let move of moves) {
        // playe the player's symbol in the array at the position of the move
        gameField[move.movePosition] = evaluatePlayer(move.player, players);
    }
    console.log("parsed moves", gameField);
    return gameField;
}

const socket = new WebSocketConnection(true);
export function subscribeGame(gameId: number) {
    socket.send(
        "subscribeGame",
        { gameId },
        false,
        undefined,
        (response: SocketResponse) => {
            if (response.success && response.action === "broadcast") {
                console.log("broadcasting data:", response.data);
                gameChange.next(response.data);
            } else {
                console.log("ignoring recieved message:", response);
            }
        }
    );
}

export function unsubscribeGame(gameId: number) {
    socket.send("unsubscribeGame", { gameId: gameId });
}

/**
 * Sends a move to the server.
 * @param gameId the Id of the game
 * @param movePosition the position of the move
 * @returns a promise that resolves to whether the move was successful
 */
export function makeMove(
    gameId: number,
    movePosition: number
): Promise<boolean> {
    return new Promise((resolve, _reject) => {
        socket.send(
            "makeMove",
            { gameId, movePosition },
            true,
            getGameKey(gameId),
            (response: SocketResponse) => resolve(response.success)
        );
    });
}

export async function loadGame(gameId: number): Promise<void> {
    // get the gameField from the API
    let response = await api("/viewGame", {
        gameId,
    });
    // if the response is successful, update the gameField
    if (response.success) {
        gameStorage.saveGame(response.data as PostGameInfo);
        gameChange.next(response.data as PostGameInfo);
    }
}

const gameStorage = {
    saveGame(gameInfo: PostGameInfo): void {
        console.log("saving game", gameInfo);
        update(gameInfo.gameId, (oldValue: PostGameInfo | undefined) => {
            console.log("updating game", { oldValue, gameInfo });
            if (oldValue === undefined) return gameInfo;
            // if the new value has less or equal 0s in the gameField, replace it
            else if (
                gameInfo.gameField.filter((x) => x === 0).length <=
                oldValue.gameField.filter((x) => x === 0).length
            ) {
                gameChange.next(gameInfo);
                return gameInfo;
            } else return oldValue;
        });
    },
    saveGames(games: PostGameInfo[]): void {
        setMany(games.map((game) => [game.gameId, game]));
        games.map((game) => gameChange.next(game));
    },
    async loadGame(gameId: number): Promise<PostGameInfo> {
        let gameInfo = (await get(gameId)) as PostGameInfo;
        if (gameInfo !== undefined) gameChange.next(gameInfo);
        return gameInfo;
    },
    async loadAllGames() {
        return (await values()).sort((a, b) => b.gameId - a.gameId);
    },
};
export { gameStorage };

/**
 * A funciton that figures out whether the user has access to a game, either by being the attacker or the defender or by having the gameKey.
 * @param gameId the gameId of the game in question
 * @param attacker the username of the attacker
 * @param defender the username of the defender
 */
export function hasAccessToGame(
    gameId: number,
    attacker: Players["attacker"],
    defender: Players["defender"]
) {
    const credentials = getCredentials();
    // if the user is the attacker or the defender, he has access to the game
    if (
        credentials &&
        (credentials.username === attacker || credentials.username === defender)
    ) {
        return true;
        // if the user has the gameKey, he has access to the game
    } else if (getGameKey(gameId)) {
        return true;
    } else {
        return false;
    }
}
