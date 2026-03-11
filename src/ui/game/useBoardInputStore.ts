import { create } from "zustand"
import { type Square, type PieceType, type Player, Move, Board } from "@/domain/kif/entity"
import type { Intent } from "./intentResolver";

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
    selection: { type: "none" },

    clickSquare: (sq, board) => {
        const sel = get().selection
        const piece = board.get(sq.file, sq.rank)
        console.log("Piece", piece)

        // ===== 盤 → 盤 =====
        if (sel.type === "board") {
            const intent: Intent = {
                type: "move",
                from: sel.square,
                to: sq
            }
            set({ selection: { type: "none" } })
            return intent
        }

        // ===== 持駒 → 盤 =====
        if (sel.type === "hand") {
            const intent: Intent = {
                type: "drop",
                pieceType: sel.pieceType,
                to: sq
            }
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
    },

    clickHandPiece: (piece, owner) => {
        const sel = get().selection
        // ===== 持駒 → 自持駒：キャンセル =====
        if (sel.type === "hand"){
            set({ selection: { type: "none"}})
            return null
        }
        set({
            selection: {
                type: "hand",
                pieceType: piece,
                owner
            }
        })

    },
    clear: () => {
        set({ selection: { type: "none" } })
    }

}))