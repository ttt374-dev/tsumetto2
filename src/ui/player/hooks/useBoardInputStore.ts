import { create } from "zustand"
import { type Square, type PieceType, type Player, Move, Board } from "@/domain/kif/entity"
import type { Intent } from "@/domain/game/intentResolver";

type InputState = 
    | { type: "idle"}
    | { type: "selected", selection: Selection}
    | { type: "pendingPromotion", intent: Intent}

export type Selection =
    | { type: "none" }
    | { type: "board"; square: Square }
    | { type: "hand"; pieceType: PieceType; owner: Player }

type BoardInputStore = {
    state: InputState,
    //selection: Selection

    clickSquare: (sq: Square, board: Board) => Intent | null
    clickHandPiece: (piece: PieceType, owner: Player) => void
    clear: () => void
}

export const useBoardInputStore = create<BoardInputStore>((set, get) => ({
    state: { type: "idle"},
    //selection: { type: "none" },

    clickSquare: (sq, board) => {
        const state = get().state
        //const sel = get().selection
        const piece = board.get(sq)

        switch(state.type){
            case "idle":
                if (!piece) return null
                if (piece.owner !== "black") return null
                set({state: {type: "selected", selection: {
                    type: "board", square: sq
                }}})
                return null
            case "selected":
                switch(state.selection.type){
                    case "board": // 盤面→盤面
                        set({state: { type: "idle"}})
                        return { type: "move", from: state.selection.square, to: sq}
                    case "hand":  // 持ち駒→盤面
                        set({state: { type: "idle"}})
                        return { type: "drop", pieceType: state.selection.pieceType, to: sq}
                    case "none":
                        return null

                }
            default:
                return null
        }
        /*
        // ===== 盤 → 盤 =====
        if (sel.type === "board") {
            const intent: Intent = { type: "move", from: sel.square, to: sq}
            set({ selection: { type: "none" } })

            console.log("board intent", intent)
            return intent
        }

        // ===== 持駒 → 盤 =====
        if (sel.type === "hand") {
            const intent: Intent = { type: "drop", pieceType: sel.pieceType, to: sq}
            set({ selection: { type: "none" } })
            return intent
        }

        // ===== 新しい選択 =====
        // ===== 空マスなら選択不可 =====
        if (!piece) {
            set({ selection: { type: "none" } })
            return null
        }
        // ===== 相手の駒なら選択不可 =====
        const currentPlayer = "black" // 手番 : TODO
        if (piece.owner !== currentPlayer) {
            set({ selection: { type: "none" } })
            return null
        }
        set({
            selection: { type: "board", square: sq }
        })
        return null
        */
    },

    clickHandPiece: (pieceType, owner) => {
        //const sel = get().selection
        const state = get().state
        if (state.type === "selected" && state.selection.type === "hand"){
            set({state: { type: "idle"}})
            return null
        }
        set({state: { type: "selected", selection: { type: "hand", pieceType: pieceType, owner: "black"}}})

        /*
        // ===== 持駒 → 自持駒：キャンセル =====
        if (sel.type === "hand"){
            set({ selection: { type: "none"}})
            return null
        }
        set({
            selection: {
                type: "hand",
                pieceType: pieceType,
                owner
            }
        })*/

    },
    clear: () => {
        set({state: { type: "idle"}})
        //set({ selection: { type: "none" } })
    }

}))