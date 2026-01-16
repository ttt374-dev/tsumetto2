import type { BoardState } from "./BoardState"
import type { PieceType, Player, Square } from "./Piece"

export class Move {
    constructor(
        readonly from: Square | null,
        readonly to: Square,
        readonly pieceType: PieceType,        
        readonly promote: boolean = false,
        readonly rawtext: string = "",
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
        console.log("tojson", this)
        return {
            from: this.from,
            to: this.to,
            pieceType: this.pieceType,            
            promote: this.promote,
            rawtext: this.rawtext,
        }
    }
    static fromJSON(dto: MoveDTO): Move {
        console.log("from json", dto)
        return new Move(
            dto.from,
            dto.to,
            dto.pieceType,            
            dto.promote,
            dto.rawtext
        )
    }
}

export type MoveDTO = {
    from: Square | null
    to: Square
    pieceType: PieceType
    promote: boolean
    rawtext: string
}
///////////////////////////////////

export type KifHistory = { 
    initial: BoardState
    moves: Move[]
}
    