import { create } from "zustand"
import { type Square, type PieceType, type Player, Move, Board, Piece } from "@/domain/kif/entity"
import type { Intent } from "@/domain/game/intentResolver";
//import type { PendingPromotion } from "./useGameStore";

/*
type InputState = 
    | { type: "idle"}
    | { type: "selected", selection: Selection}
    //| { type: "pendingPromotion", pendingPromotion: PendingPromotion}
*/
export type Selection =
    | { type: "none" }
    | { type: "board"; square: Square }
    | { type: "hand"; pieceType: PieceType; owner: Player }

type BoardInputStore = {
    //state: InputState,
    selection: Selection

    clickSquare: (sq: Square, board: Board) => Intent | null
    clickHandPiece: (piece: PieceType, owner: Player) => void
    //choosePromotion: (promote: boolean) => Intent
    clear: () => void
}

export const useBoardInputStore = create<BoardInputStore>((set, get) => ({
    //state: { type: "idle"},
    selection: { type: "none" },

    clickSquare: (sq, board) => {
        //const state = get().state
        const selection = get().selection
        const piece = board.get(sq)
        //if (!piece) return null
        console.log("piece", piece)

        switch(selection.type){
            case "none":
                if (!piece) return null
                if (piece.owner !== "black") return null
                set({ selection: {type: "board", square: sq}})
                return null
            
                
            case "board": // 盤面→盤面
                set({ selection: { type: "none" } })
                //console.log("can promote", canPromote(state.selection.square, sq, state.selection.piece))
                /*
                if (canPromote(state.selection.square, sq)){
                    set({state: {
                        type: "pendingPromotion",
                        pendingPromotion: { from: state.selection.square, to: sq}
                    }})
                    console.log("pendingPromotion")
                    return null
                }
                console.log("board to board", state, sq)*/
                return { type: "move", from: selection.square, to: sq, promote: false }
            case "hand":  // 持ち駒→盤面
                set({ selection: { type: "none" } })
                return { type: "drop", pieceType: selection.pieceType, to: sq }
            case "none":
                return null
                
        }
    },

    clickHandPiece: (pieceType, owner) => {
        const selection = get().selection
        //const state = get().state
        if (selection.type === "hand"){
            set({selection: { type: "none"}})
            return null
        }
        set({ selection: { type: "hand", pieceType: pieceType, owner: "black"}})        

    },
    /*
    choosePromotion: (promote: boolean) => {
        const state = get().state
        if (state.type !== "pendingPromotion") throw new Error()
        
        set({state: { type: "idle" }})
        return {
            type: "move",
            from: state.pendingPromotion.from,
            to: state.pendingPromotion.to,
            promote
        }
    },*/
    clear: () => {
        set({selection: { type: "none"}})
    }

}))