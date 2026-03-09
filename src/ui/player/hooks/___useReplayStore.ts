import { create } from "zustand"
import { type Move, type Square, type Piece, type Player, Position, type PieceType } from "@/domain/kif/entity"
import { buildUntilPly } from "@/domain/kif/service/buildUntilPly"
import { clamp } from "lodash"

type SolvePhase = "solving" | "completed" | "revealed"
//export type InputPhase = "idle" | "pieceSelected" | "handpieceSelected" | "promotionConfirm"

export type TryMoveResult =
    | { type: "correct" }          // 正しい手（途中）
    | { type: "finish" }           // 最終手
    | { type: "incorrect" }        // 不正解
    | { type: "cancel" }           // 同じ場所クリック
    | { type: "no-selection" }     // 駒未選択
    | { type: "promotion-choice" }


type SelectedState =
    | { type: "idle"}
    | { type: "board", square: Square }
    | { type: "hand", pieceType: PieceType, player: Player}    
    | { type: "cancel"}
    | { type: "promotionConfirm"}
    | { type: "pendingPromotion"}

type ReplayStore = {
    initialPosition: Position
    moves: Move[]

    position: Position
    plyIndex: number
    
    solvePhase: SolvePhase
    selectedState: SelectedState | null
    pendingPromotion: Move | null

    // 派生値
    currentPlayer: Player
    isFinished: boolean

    // 基本操作
    load: (initial: Position, moves: Move[]) => void
    moveToPly: (index: number) => void
    advancePly: () => void
    retreatPly: () => void
    reset: () => void
    unselect: () => void

    // 駒選択・移動
    selectSquare: (file: number, rank: number) => void
    selectHandPiece: (pieceType: PieceType, player: Player) => void
    tryMoveTo: (to: Square) => TryMoveResult
    confirmPromosion: (flag: boolean) => void
}

/////////////////////////////////////////////////////
export const useReplayStore___ = create<ReplayStore>((set, get) => ({
    // problem
    initialPosition: Position.empty(),
    moves: [],

    position: Position.empty(),
    plyIndex: 0,
    
    solvePhase: "solving",
    selectedState: null,
    pendingPromotion: null,

    // 計算プロパティ
    get currentPlayer() {
        // 0: black, 1: white, 2: black...
        return get().plyIndex % 2 === 0 ? "black" : "white"
    },
    get isFinished(): boolean {
        return get().plyIndex + 1 >= get().moves.length
    },

    load: (initial, moves) => {
        set({ initialPosition: initial, moves})
        get().reset()
    },
    reset: () => {   
        set({solvePhase: "solving", selectedState: { type: "idle"}})     
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

    selectSquare: (file, rank) => {
        set({ 
            selectedState: { type: "board", square: { file, rank } },
        })

    },
    selectHandPiece: (pieceType: PieceType, player: Player) => {
        set({
            selectedState: {type: "hand",pieceType,player},

        })
    },
    unselect: () => {
        set({ selectedState: null })
    },
    confirmPromosion: (promote: boolean) => {

    },

    tryMoveTo: (to: Square): TryMoveResult => {
        const { selectedState: selected, moves, plyIndex } = get()
        if (!selected) return { type: "cancel" }

        const move = moves[plyIndex]

        // 持ち駒打ち
        if (selected.type === "hand") {
            const isCorrect =
                move.from === null &&
                move.to.file === to.file &&
                move.to.rank === to.rank //&&
            //move.piece === selected.piece.type

            if (!isCorrect) {
                set({ selectedState: null })
                return { type: "incorrect" }
            }

            const isLast = plyIndex + 1 >= moves.length

            get().advancePly()
            // 白の手を自動
            get().advancePly() 
            set({ selectedState: null })

            return isLast ? { type: "finish" } : { type: "correct" }
        }

        // 盤上の駒移動
        if (selected.type === "board") {
            const isCorrect =
                move.from?.file === selected.square.file &&
                move.from?.rank === selected.square.rank &&
                move.to.file === to.file &&
                move.to.rank === to.rank

            if (!isCorrect) {
                set({ selectedState: null })
                return { type: "incorrect" }
            }
        }

        const isLast = plyIndex + 1 >= moves.length

        get().advancePly()
        set({ selectedState: null })

        return isLast ? { type: "finish" } : { type: "correct" }
    },

    confirmPromotion: (promote: boolean) => {
        const { pendingPromotion } = get()
        if (!pendingPromotion) return

        const isLast = get().plyIndex + 1 >= get().moves.length

        get().advancePly()

        set({
            pendingPromotion: null,
            selectedState: null
        })

        return isLast ? "finish" : "correct"
    }
}))