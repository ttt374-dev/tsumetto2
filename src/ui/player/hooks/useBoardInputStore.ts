import { create } from "zustand"
import { type Square, type PieceType, type Player, Move } from "@/domain/kif/entity"

type SelectedState =
    | { type: "idle" }
    | { type: "selected"; source: "board"; square: Square }
    | { type: "selected"; source: "hand"; pieceType: PieceType }

type BoardInputStore = {
    selectedState: SelectedState
    selectSquare: (square: Square) => void
    selectHandPiece: (pieceType: PieceType, owner: Player) => void
    unselect: () => void
}

export const useBoardInputStore = create<BoardInputStore>((set, get) => ({
    selectedState: { type: "idle" },
    showMoves: false,

    selectSquare: (square) => 
        set({ selectedState: { type: "selected", source: "board", square } }),
    selectHandPiece: (pieceType) => 
        set({ selectedState: { type: "selected", source: "hand", pieceType } }),
    unselect: () => set({ selectedState: { type: "idle" } }),

}))