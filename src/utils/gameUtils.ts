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
export function parseMoves(
    moves: Move[],
    players: GameMetaData["players"]
): PostGameInfo["gameField"] {
    console.log("parsing moves", moves, players);
    // create an empty game field
    let gameField: PostGameInfo["gameField"] = Array(9).fill(undefined);
    // iterate over all moves
    for (let move of moves) {
        // playe the player's symbol in the array at the position of the move
        gameField[move.movePosition] = evaluatePlayer(move.player, players);
    }
    console.log("parsed moves", gameField);
    return gameField;
}
