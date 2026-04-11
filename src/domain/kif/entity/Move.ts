import type { Position } from "./Position"
import type { PieceType } from "./Piece"
import type { Square } from "@/domain/kif/entity/Square"

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

    equals(move: Move): boolean {
        const a = this
        const b = move
        console.log("eq move", a, b)

        return a.from?.rank === b.from?.rank &&
            a.from?.file === b.from?.file &&
            a.to.file === b.to.file &&
            a.to.rank === b.to.rank &&
            a.pieceType === b.pieceType &&
            a.promote === b.promote
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
    