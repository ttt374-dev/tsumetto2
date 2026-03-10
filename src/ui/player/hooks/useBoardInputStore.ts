import { create } from "zustand"
import { type Square, type PieceType, type Player, Move } from "@/domain/kif/entity"

type SelectedState =
    | { type: "idle" }
    | { type: "selected"; source: "board"; square: Square }
    | { type: "selected"; source: "hand"; pieceType: PieceType }
//    | { type: "board"; square: Square }               // 盤上駒選択
    //| { type: "hand"; pieceType: PieceType }  // 持ち駒選択
    //| { type: "promotionConfirm"; move: Move }       // 成るか確認中
    //| { type: "pendingPromotion"; move: Move }       // 成るか選択待ち
    //| { type: "promotionConfirmed"; move: Move, promote: boolean}
    | { type: "cancel" }

type BoardInputStore = {
    selectedState: SelectedState
    //showMoves: boolean
    selectSquare: (square: Square) => void
    selectHandPiece: (pieceType: PieceType, owner: Player) => void
    unselect: () => void
    //pendingPromotion: (move: Move) => void
    //promotionConfirmed: (move: Move, promote: boolean) => void
    //confirmToPromote: (move: Move) => void

    //setShowMoves: (flag: boolean) => void
    giveUp: () => void
}

export const useBoardInputStore = create<BoardInputStore>((set, get) => ({
    selectedState: { type: "idle" },
    showMoves: false,

    selectSquare: (square) => 
        set({ selectedState: { type: "selected", source: "board", square } }),
    selectHandPiece: (pieceType, player) => 
        set({ selectedState: { type: "selected", source: "hand", pieceType } }),
    unselect: () => set({ selectedState: { type: "idle" } }),
    //pendingPromotion: (move: Move) => set({ selectedState: { type: "pendingPromotion", move}}),
    //promotionConfirmed: (move: Move, promote: boolean) => set({ selectedState: { type: "promotionConfirmed", move, promote}}),
    // ギブアップ
    giveUp: () => {
        //get().setShowMoves(true)
        set({ selectedState: { type: "idle" } })
    }
}))