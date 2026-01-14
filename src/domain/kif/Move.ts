import type { BoardState } from "./BoardState"
import type { PieceType, Square } from "./Piece"

export class Move {
    constructor(
        readonly from: Square | null,
        readonly to: Square,
        readonly pieceType: PieceType,
        readonly promote: boolean = false
    ) { }

    isDrop(): boolean {
        return this.from === null
    }

    apply(state: BoardState): BoardState {
        return state.applyMove(this)
    }
    /////////////////////////////////
    // serialize

    toJSON(): MoveDTO {
        return {
            from: this.from,
            to: this.to,
            pieceType: this.pieceType,
            promote: this.promote,
        }
    }
    static fromJSON(dto: MoveDTO): Move {
        return new Move(
            dto.from,
            dto.to,
            dto.pieceType,
            dto.promote
        )
    }
}

export type MoveDTO = {
    from: Square | null
    to: Square
    pieceType: PieceType
    promote: boolean
}
