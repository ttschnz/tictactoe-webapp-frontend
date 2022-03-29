import { GameMetaData, Move, PostGameInfo } from "./types";

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
    players: GameMetaData["players"]
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
// TODO: returns empty game field at the moment - should be filled with moves
export function parseMoves(moves: Move[]): PostGameInfo["gameField"] {
    return [0, 0, 0, 0, 0, 0, 0, 0, 0];
}
