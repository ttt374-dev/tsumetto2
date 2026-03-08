import { create } from "zustand"
import type { Position, Move, Square, Piece, Player } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"

type SelectedState = {
    square: Square
    piece: Piece
} | null

type ReplayStore = {
    position: Position
    plyIndex: number
    moves: Move[]
    selected: SelectedState

    // 派生値
    currentPlayer: Player
    isFinished: boolean

    // 基本操作
    moveToPly: (index: number) => void
    advancePly: () => void
    retreatPly: () => void
    reset: (initial: Position, moves: Move[]) => void

    // 駒選択・移動
    selectSquare: (file: number, rank: number, piece?: Piece) => void
    tryMoveTo: (to: Square) => boolean
}

export const useReplayStore = create<ReplayStore>((set, get) => ({
    position: {} as Position,
    plyIndex: 0,
    moves: [],
    selected: null,

     // 計算プロパティ
    get currentPlayer() {
        // 0: black, 1: white, 2: black...
        return get().plyIndex % 2 === 0 ? "black" : "white"
    },
    get isFinished(): boolean {
        return get().plyIndex + 1 >= get().moves.length
    },

    reset: (initial, moves) => set({ position: initial, plyIndex: 0, moves, selected: null }),

    moveToPly: (index) => {
        const { moves } = get()
        set({ plyIndex: Math.min(Math.max(0, index), moves.length) })
        set({ position: buildUntilPly({ initial: get().position, moves }, get().plyIndex) })
    },

    advancePly: () => {
        const { plyIndex, moves } = get()
        get().moveToPly(plyIndex + 1)
    },

    retreatPly: () => {
        const { plyIndex } = get()
        get().moveToPly(plyIndex - 1)
    },

    selectSquare: (file, rank, piece) => {
        if (piece) {
            set({ selected: { square: { file, rank }, piece } })
        } else {
            set({ selected: null })
        }
    },

    tryMoveTo: (to: Square) => {
        const { selected, moves, plyIndex } = get()
        if (!selected) return false

        const move = moves[plyIndex]
        // from と to と type をチェック
        const isSameMove =
            move.from?.file === selected.square.file &&
            move.from?.rank === selected.square.rank &&
            move.to.file === to.file &&
            move.to.rank === to.rank &&
            move.promote === selected.piece.promoted // 成り判定も含む

        if (isSameMove) {
            get().advancePly()
            set({ selected: null })
            return true
        } else {
            // 間違った手の通知用に false を返す
            return false
        }
    },
}))