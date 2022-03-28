export type Credentials = {
   username: string;
   token: string;
   tokenExpiration: number;
   inCompetition: boolean;
};

export type JSONResponse = {
   success: boolean;
   data?: any;
   error?: any;
};

export type listener = {
   resolve: Function;
   reject: Function;
};
export type messageListener = {
   [key: string]: listener;
};

export type SocketResponse = JSONResponse & {
   action: string;
   msgId: string;
};

declare global {
   interface Window {
      forge: any;
   }
}

export interface PostGameInfo {
   attacker: string;
   defender: string;
   gameField: Array<-1 | 0 | 1>;
   gameId: number;
   isDraw: boolean;
   isFinished: boolean;
   winner: string | null | false;
}

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
}
export type PositionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Move {
   gameId: string;
   moveIndex: number;
   movePosition: PositionIndex;
   player: string;
}
