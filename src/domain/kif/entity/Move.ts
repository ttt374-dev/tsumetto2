import type { Position } from "./Position"
import type { PieceType, Player, Square } from "./Piece"

export class Move {
    constructor(
        readonly from: Square | null,
        readonly to: Square,
        readonly pieceType: PieceType,        
        readonly promote: boolean = false,
        readonly rawtext: string = "",
    ) { }

    isMove(): boolean {
        return this.from !== null
    }
    isDrop(): boolean {
        return this.from === null
    }

    
    apply(state: Position): Position {
        return state.applyMove(this)
    }
    /////////////////////////////////
    // serialize

    toDTO(): MoveDTO {
        return {
            from: this.from,
            to: this.to,
            pieceType: this.pieceType,            
            promote: this.promote,
            rawtext: this.rawtext,
        }
    }
    static fromDTO(dto: MoveDTO): Move {
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
    initial: Position
    moves: Move[]
}
    