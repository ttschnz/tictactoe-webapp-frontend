import { GameMetaData, Move, PostGameInfo } from "./types";

export function gameIdToHex(gameId: number): string {
   return gameId.toString(16);
}
export function gameIdFromHex(gameId: string): number {
   return Number(`0x${gameId}`);
}
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

export function parseMoves(moves: Move[]): PostGameInfo["gameField"] {
   return [0, 0, 0, 0, 0, 0, 0, 0, 0];
}
