import { create } from "zustand"
import { type Square, type PieceType, type Player, Move } from "@/domain/kif/entity"

export type SelectedState =
    | { type: "idle" }
    | { type: "selected"; source: "board"; square: Square }
    | { type: "selected"; source: "hand"; pieceType: PieceType }

type BoardInputStore = {
    selectedState: SelectedState
    selectSquare: (square: Square) => void
    selectHandPiece: (pieceType: PieceType, owner: Player) => void
    clearSelection: () => void
}

export const useBoardInputStore = create<BoardInputStore>((set, get) => ({
    selectedState: { type: "idle" },
    showMoves: false,

    selectSquare: (square) => 
        set({ selectedState: { type: "selected", source: "board", square } }),
    selectHandPiece: (pieceType) => 
        set({ selectedState: { type: "selected", source: "hand", pieceType } }),
    clearSelection: () => set({ selectedState: { type: "idle" } }),

}))