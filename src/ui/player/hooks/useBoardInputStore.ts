import { create } from "zustand"
import { type Square, type PieceType, type Player, Move, Board, Piece } from "@/domain/kif/entity"
import type { Intent } from "@/domain/game/intentResolver";

export type Selection =
    | { type: "none" }
    | { type: "board"; square: Square }
    | { type: "hand"; pieceType: PieceType; owner: Player }

type BoardInputStore = {
    selection: Selection

    clickSquare: (sq: Square, board: Board) => Intent | null
    clickHandPiece: (piece: PieceType, owner: Player) => void
    clear: () => void
}

export const useBoardInputStore = create<BoardInputStore>((set, get) => ({
    //state: { type: "idle"},
    selection: { type: "none" },

    clickSquare: (sq, board) => {
        const selection = get().selection
        const piece = board.get(sq)
        const userplayer = "black"

        switch(selection.type){
            case "none":
                if (!piece) return null
                if (piece.owner !== userplayer) return null
                set({ selection: {type: "board", square: sq}})
                return null            
                
            case "board": // 盤面→盤面                
                if (sq.equals(selection.square)){
                //if (sq.file === selection.square.file && sq.rank === selection.square.rank) {  // 同じマスならキャンセル
                    set({ selection: { type: "none" } })    
                    return null 
                }
                if (piece?.owner === userplayer) return null
                return { type: "move", from: selection.square, to: sq, promote: false }
            case "hand":  // 持ち駒→盤面
                set({ selection: { type: "none" } })
                return { type: "drop", pieceType: selection.pieceType, to: sq }                       
        }
    },

    clickHandPiece: (pieceType, owner) => {
        const selection = get().selection
        if (selection.type === "hand"){
            set({selection: { type: "none"}})
        }
        set({ selection: { type: "hand", pieceType: pieceType, owner: owner}})        

    },    
    clear: () => {
        set({selection: { type: "none"}})
    }

}))