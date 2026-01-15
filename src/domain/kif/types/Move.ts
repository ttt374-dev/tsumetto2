import type { BoardState } from "./BoardState"
import type { PieceType, Player, Square } from "./Piece"

export class Move {
    constructor(
        readonly from: Square | null,
        readonly to: Square,
        readonly pieceType: PieceType,
        readonly player: Player,
        readonly promote: boolean = false,
        readonly info: string = "",
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
            player: this.player,
            promote: this.promote,
            info: this.info,
        }
    }
    static fromJSON(dto: MoveDTO): Move {
        return new Move(
            dto.from,
            dto.to,
            dto.pieceType,
            dto.player,
            dto.promote,
            dto.info
        )
    }
}

export type MoveDTO = {
    from: Square | null
    to: Square
    pieceType: PieceType
    player: Player
    promote: boolean
    info: string
}
///////////////////////////////////

export type KifHistory = { 
    initial: BoardState
    moves: Move[]
}
    