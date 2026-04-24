import { Board, type BoardDTO } from "./Board"
import { Hand, Hands, type HandDTO } from "./Hand"
import { Piece, type PieceType, type Player } from "./Piece"
import type { Move } from "./Move"
import type { Result } from "@/shared/result"

export type ApplyMoveError = 
    | { code: "no-piece-from"}
    | { code: "not-enough-piece", pieceType: PieceType}

export class Position {
    constructor(
        readonly board: Board,
        readonly hands: Hands,
        readonly sideToMove: Player = "black"
    ) { }
    static create(): Position {
        return new Position(Board.create(), Hands.empty())
    }
    static empty(): Position {
        return new Position(Board.empty(), Hands.empty())
    }

    applyMove(move: Move): Result<Position, ApplyMoveError> {
        if (move.isDrop()) {
            return this.applyDrop(move)
        }
        return this.applyNormalMove(move)
    }

    private applyNormalMove(move: Move): Result<Position, ApplyMoveError> {
        const from = move.from!
        const to = move.to

        let piece = this.board.get(from)
        const fromStr = `${from.file}, ${from.rank}`
        if (!piece) return { ok: false, error: { code: "no-piece-from"}}

        // capture
        const target = this.board.get(to)
        let hands = this.hands
        if (target) {
            const resHands = hands.add(this.sideToMove, target.type)
            if(!resHands.ok) return resHands
            hands = resHands.value

        }

        // promote
        if (move.promote) {
            piece = piece.promote()
        }

        const nextBoard =
            this.board
                .set(from, null)
                .set(to, piece)
        //console.log("apply move", nextBoard.dump(), piece)

        return { ok: true, value: new Position(
            nextBoard,
            hands,
            flip(this.sideToMove)
        )}
    }
    private applyDrop(move: Move): Result<Position, ApplyMoveError> {
        //console.log("apply drop", move, this.sideToMove, this.hands.toDTO())
        const piece = new Piece(move.pieceType, this.sideToMove)
        

        const nextBoard = this.board.set(move.to, piece)
        //const nextHands = this.hands.remove(this.sideToMove, move.pieceType)
        const resHands = this.hands.remove(this.sideToMove, move.pieceType)
        if (!resHands.ok) return resHands
        //const nextHands = {
        //    ...this.hands,
        //    [this.turn]: this.hands[this.turn].remove(move.pieceType)
        //}

        return { ok: true, value: new Position(
            nextBoard,
            resHands.value,
            flip(this.sideToMove)
        )}
    }
    //////////////////////////
    // serialize    
    toDTO(): PositionDTO {
        return {
            board: this.board.toDTO(),
            hands: this.hands.toDTO(),
            turn: this.sideToMove,
        }
    }

    static fromDTO(dto: PositionDTO): Position {
        return new Position(
            Board.fromDTO(dto.board),
            Hands.fromDTO(dto.hands),
            
            dto.turn
        )
    }
}

const flip = (c: Player): Player => (c === "black" ? "white" : "black")

export type PositionDTO = {
    board: BoardDTO
    hands: {
        black: HandDTO
        white: HandDTO
    }
    turn: "black" | "white"
}
