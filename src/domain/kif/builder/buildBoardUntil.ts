import type { Board, Hands, Move } from "../types";
import { applyMove } from "./applyMove";

type ReplayState = {
  board: Board;
  hands: Hands;
};
export function buildBoardUntil(
        initialBoard: Board, 
        initialHands: Hands, 
        //events: KifEvent[],
        moves: Move[],
        plyIndex: number): ReplayState {
        const board = cloneBoard(initialBoard);
        const hands = cloneHands(initialHands)                  
        
        for (let i = 0; i <= plyIndex; i++) {
            const moveIndex = i - 1 // vieweIndex: 0 は初期盤面    
            const move = moves[moveIndex]
            if (!move) continue   // 防護
            if (move.type === "move")
                applyMove(board, hands, move);
        }
        //console.log("built board", board)
        return { board, hands }
    }
    function cloneBoard(board: Board): Board {
        return board.map(row =>
            row.map(cell => (cell ? { ...cell } : null))
        );
    }
    function cloneHands(hands: Hands): Hands {
        return {
            black: { ...hands.black },
            white: { ...hands.white },
        };
    }
