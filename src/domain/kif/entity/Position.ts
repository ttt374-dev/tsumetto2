import { Board, type BoardDTO } from "./Board"
import { Hand, Hands, type HandDTO } from "./Hand"
import { Piece, type Player } from "./Piece"
import type { Move } from "./Move"

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

    applyMove(move: Move): Position {
        if (move.isDrop()) {
            return this.applyDrop(move)
        }
        return this.applyNormalMove(move)
    }

    private applyNormalMove(move: Move): Position {
        const from = move.from!
        const to = move.to

        let piece = this.board.get(from.file, from.rank)
        const fromStr = `${from.file}, ${from.rank}`
        if (!piece) throw new Error(`no piece on from: [${move.pieceType}] [${fromStr}]`)

        // capture
        const target = this.board.get(to.file, to.rank)
        let hands = this.hands
        if (target) {
            hands = hands.add(this.sideToMove, target.type)
        }

        // promote
        if (move.promote) {
            piece = piece.promote()
        }

        const nextBoard =
            this.board
                .set(from.file, from.rank, null)
                .set(to.file, to.rank, piece)
        //console.log("apply move", nextBoard.dump(), piece)

        return new Position(
            nextBoard,
            hands,
            flip(this.sideToMove)
        )
    }
    private applyDrop(move: Move): Position {
        console.log("apply drop", move, this.sideToMove, this.hands.toDTO())
        const piece = new Piece(move.pieceType, this.sideToMove)
        

        const nextBoard = this.board.set(move.to.file, move.to.rank, piece)
        const nextHands = this.hands.remove(this.sideToMove, move.pieceType)
        //const nextHands = {
        //    ...this.hands,
        //    [this.turn]: this.hands[this.turn].remove(move.pieceType)
        //}

        return new Position(
            nextBoard,
            nextHands,
            flip(this.sideToMove)
        )
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
