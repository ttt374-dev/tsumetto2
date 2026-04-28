import { create } from "zustand"

import { type Square, type PieceType, type Player, Board, Position} from "@/domain/kif/entity"
import type { Intent } from "@/domain/game/intentResolver";
import { getCurrentPosition } from "@/ui/screens/player/store/useGameStore";

export type Selection =
    | { type: "none" }
    | { type: "board"; square: Square }
    | { type: "hand"; pieceType: PieceType; owner: Player }

type BoardInputStore = {
    selection: Selection

    clickSquare: (sq: Square) => Intent | null
    clickHandPiece: (piece: PieceType, owner: Player) => void
    clear: () => void
}


export const useBoardInputStore = create<BoardInputStore>((set, get) => ({
    //state: { type: "idle"},
    selection: { type: "none" },

    clickSquare: (sq) => {
        const resPosition = getCurrentPosition()
        if (!resPosition.ok) return null
        const position = resPosition.value
        const piece = position.board.get(sq)       
        const selection = get().selection

        switch(selection.type){
            case "none":
                if (!piece) return null
                if (piece.owner !== position.sideToMove) return null
                set({ selection: {type: "board", square: sq}})
                return null            
                
            case "board": // 盤面→盤面                
                if (sq.equals(selection.square)){
                    set({ selection: { type: "none" } })    
                    return null 
                }
                if (piece?.owner === position.sideToMove) return null
                return { type: "move", from: selection.square, to: sq, promote: false }
            case "hand":  // 持ち駒→盤面
                set({ selection: { type: "none" } })
                return { type: "drop", pieceType: selection.pieceType, to: sq }                       
        }
    },

    clickHandPiece: (pieceType, owner) => {
        const selection = get().selection
        /*
        if (selection.type === "hand"){
            set({selection: { type: "none"}})
            return
        }*/
        if (selection.type === "hand" && selection.pieceType === pieceType){
            set({selection: { type: "none"}})
            return
        }
        set({ selection: { type: "hand", pieceType: pieceType, owner: owner}})        

    },    
    clear: () => {
        set({selection: { type: "none"}})
    }

}))