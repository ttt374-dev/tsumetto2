import { create } from "zustand"
import { type Move, type Square, type Piece, type Player, Position } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { clamp } from "lodash"

type TryMoveResult =
    | { type: "correct" }          // 正しい手（途中）
    | { type: "finish" }           // 最終手
    | { type: "incorrect" }        // 不正解
    | { type: "cancel" }           // 同じ場所クリック
    | { type: "no-selection" }     // 駒未選択
    | { type: "promotion-choice" }

type SelectedState = {
    square: Square
    piece: Piece
} | null

type ReplayStore = {
    initialPosition: Position
    position: Position
    plyIndex: number
    moves: Move[]
    selected: SelectedState
    pendingPromotion: Move | null

    // 派生値
    currentPlayer: Player
    isFinished: boolean

    // 基本操作
    moveToPly: (index: number) => void
    advancePly: () => void
    retreatPly: () => void
    reset: (initial: Position, moves: Move[]) => void
    unselect: () => void

    // 駒選択・移動
    selectSquare: (file: number, rank: number, piece?: Piece) => void
    tryMoveTo: (to: Square) => TryMoveResult
    confirmPromosion: (flag: boolean) => void
}

/////////////////////////////////////////////////////
export const useReplayStore = create<ReplayStore>((set, get) => ({
    initialPosition: Position.empty(),
    position: Position.empty(),
    plyIndex: 0,
    moves: [],
    selected: null,
    pendingPromotion: null,

    // 計算プロパティ
    get currentPlayer() {
        // 0: black, 1: white, 2: black...
        return get().plyIndex % 2 === 0 ? "black" : "white"
    },
    get isFinished(): boolean {
        return get().plyIndex + 1 >= get().moves.length
    },

    reset: (initial, moves) => {
        set({ initialPosition: initial, moves, selected: null })
        get().moveToPly(0)
    },

    moveToPly: (index) => {
        const { moves, initialPosition } = get()

        const newPlyIndex = clamp(index, 0, moves.length)

        set({
            plyIndex: newPlyIndex,
            position: buildUntilPly(
                { initial: initialPosition, moves },
                newPlyIndex
            )
        })
    },

    advancePly: () => {
        const { plyIndex } = get()
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
    unselect: () => {
        set({ selected: null })
    },
    confirmPromosion: (promote: boolean) => {

    },

    tryMoveTo: (to: Square): TryMoveResult => {
        const { selected, moves, plyIndex } = get()
        if (!selected) return { type: "cancel" }

        const move = moves[plyIndex]

        const sameSquare =
            selected.square.file === to.file &&
            selected.square.rank === to.rank

        if (sameSquare) {
            set({ selected: null })
            return { type: "cancel" }
        }

        const isCorrect =
            move.from?.file === selected.square.file &&
            move.from?.rank === selected.square.rank &&
            move.to.file === to.file &&
            move.to.rank === to.rank

        if (!isCorrect) {
            set({ selected: null })
            return { type: "incorrect" }
        }

        // 成り選択が必要
        if (move.promote === undefined) {
            set({
                pendingPromotion: move
            })
            return { type: "promotion-choice" }
        }
        const isLast = plyIndex + 1 >= moves.length

        get().advancePly()
        set({ selected: null })

        return isLast ? { type: "finish" } : { type: "correct" }
    },

    confirmPromotion: (promote: boolean) => {
        const { pendingPromotion } = get()
        if (!pendingPromotion) return

        const isLast = get().plyIndex + 1 >= get().moves.length

        get().advancePly()

        set({
            pendingPromotion: null,
            selected: null
        })

        return isLast ? "finish" : "correct"
    }
}))