import { create } from "zustand"
import { type Square, type PieceType, type Player, Move, Board, Piece } from "@/domain/kif/entity"
import type { Intent } from "@/domain/game/intentResolver";
import { canPromote } from "@/domain/kif/rules";
import type { PendingPromotion } from "./useGameStore";
import { Satellite } from "@mui/icons-material";

type InputState = 
    | { type: "idle"}
    | { type: "selected", selection: Selection}
    | { type: "pendingPromotion", pendingPromotion: PendingPromotion}

export type Selection =
    | { type: "none" }
    | { type: "board"; square: Square, piece: Piece }
    | { type: "hand"; pieceType: PieceType; owner: Player }

type BoardInputStore = {
    state: InputState,
    //selection: Selection

    clickSquare: (sq: Square, board: Board) => Intent | null
    clickHandPiece: (piece: PieceType, owner: Player) => void
    choosePromotion: (promote: boolean) => Intent
    clear: () => void
}

export const useBoardInputStore = create<BoardInputStore>((set, get) => ({
    state: { type: "idle"},
    //selection: { type: "none" },

    clickSquare: (sq, board) => {
        const state = get().state
        //const sel = get().selection
        const piece = board.get(sq)
        //if (!piece) return null
        console.log("piece", piece)

        switch(state.type){
            case "idle":
                if (!piece) return null
                if (piece.owner !== "black") return null
                set({state: {type: "selected", selection: {
                    type: "board", square: sq, piece,
                }}})
                return null
            case "selected":
                switch(state.selection.type){
                    case "board": // 盤面→盤面
                        set({state: { type: "idle"}})
                        console.log("can promote", canPromote(state.selection.square, sq, state.selection.piece))
                        if (canPromote(state.selection.square, sq, state.selection.piece)){
                            set({state: {
                                type: "pendingPromotion",
                                pendingPromotion: { from: state.selection.square, to: sq, pieceType: state.selection.piece.type}
                            }})
                            console.log("pendingPromotion")
                            return null
                        }
                        console.log("board to board", state, sq)
                        return { type: "move", from: state.selection.square, to: sq, promote: false}
                    case "hand":  // 持ち駒→盤面
                        set({state: { type: "idle"}})
                        return { type: "drop", pieceType: state.selection.pieceType, to: sq}
                    case "none":
                        return null

                }
            default:
                return null
        }
    },

    clickHandPiece: (pieceType, owner) => {
        //const sel = get().selection
        const state = get().state
        if (state.type === "selected" && state.selection.type === "hand"){
            set({state: { type: "idle"}})
            return null
        }
        set({state: { type: "selected", selection: { type: "hand", pieceType: pieceType, owner: "black"}}})        

    },
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
    },
    clear: () => {
        set({state: { type: "idle"}})
    }

}))