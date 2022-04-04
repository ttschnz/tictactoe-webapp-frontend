import WebSocketConnection, { api } from "../api/apiService";
import { getGameKey } from "../api/credentials";
import { gameChange } from "./subjects";
import {
    GameMetaData,
    Move,
    PostGameInfo,
    SocketResponse,
    Players,
} from "./types";
import { set, setMany, get, values, update } from "idb-keyval";

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

export function parseMetaData(
    gameMetaData: GameMetaData,
    gameId: number
): PostGameInfo {
    const { attacker, defender } = gameMetaData.players;
    const { isDraw, winner, finished } = gameMetaData.gameState;
    return {
        attacker,
        defender,
        gameId,
        isDraw: isDraw === undefined ? false : isDraw,
        winner: winner === undefined ? false : winner,
        isFinished: finished ?? false,
        gameField: parseMoves(gameMetaData.moves, {
            attacker,
            defender,
        }),
    };
}

const socket = new WebSocketConnection(true);
export function subscribeGame(gameId: number) {
    socket.send(
        "subscribeGame",
        { gameId: gameId },
        false,
        undefined,
        (response: SocketResponse) => {
            if (response.success && response.action === "broadcast") {
                gameChange.next(response.data);
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
            { gameId: gameId, movePosition: movePosition },
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
        update(gameInfo.gameId, (oldValue: PostGameInfo | undefined) => {
            if (oldValue === undefined) return gameInfo;
            // if the old value has less or equal 0s in the gameField, replace it
            else if (
                oldValue.gameField.filter((x) => x === 0).length <=
                gameInfo.gameField.filter((x) => x === 0).length
            ) {
                return gameInfo;
            } else return oldValue;
        });
        set(gameInfo.gameId, gameInfo);
    },
    saveGames(games: PostGameInfo[]): void {
        setMany(games.map((game) => [game.gameId, game]));
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
