import type { initialReplayState } from "@/application/replayReducer"
import { Board, type BoardDTO } from "./Board"
import { Hand, Hands, type HandDTO } from "./Hand"
import { Piece, type Player } from "./Piece"
import type { Move } from "./Move"

export class BoardState {
    constructor(
        readonly board: Board,
        readonly hands: Hands,
        readonly turn: Player = "black"
    ) { }
    static create(): BoardState {
        return new BoardState(Board.create(), Hands.empty())
    }

    applyMove(move: Move): BoardState {
        if (move.isDrop()) {
            return this.applyDrop(move)
        }
        return this.applyNormalMove(move)
    }

    private applyNormalMove(move: Move): BoardState {
        const from = move.from!
        const to = move.to

        let piece = this.board.get(from)
        const fromStr = `${from.file}, ${from.rank}`
        if (!piece) throw new Error(`no piece on from: [${move.pieceType}] [${fromStr}]`)

        // capture
        const target = this.board.get(to)
        let hands = this.hands
        if (target) {
            hands = hands.add(this.turn, target.type)
        }

        // promote
        if (move.promote) {
            piece = piece.promote()
        }

        const nextBoard =
            this.board
                .set(from, null)
                .set(to, piece)

        return new BoardState(
            nextBoard,
            hands,
            flip(this.turn)
        )
    }
    private applyDrop(move: Move): BoardState {
        const piece = new Piece(move.pieceType, this.turn)

        const nextBoard = this.board.set(move.to, piece)
        const nextHands = this.hands.remove(this.turn, move.pieceType)
        //const nextHands = {
        //    ...this.hands,
        //    [this.turn]: this.hands[this.turn].remove(move.pieceType)
        //}

        return new BoardState(
            nextBoard,
            nextHands,
            flip(this.turn)
        )
    }
    //////////////////////////
    // serialize    
    toJSON(): BoardStateDTO {
        return {
            board: this.board.toJSON(),
            hands: this.hands.toJSON(),
            turn: this.turn,
        }
    }

    static fromJSON(dto: BoardStateDTO): BoardState {
        return new BoardState(
            Board.fromJSON(dto.board),
            Hands.fromJSON(dto.hands),
            
            dto.turn
        )
    }
}



const flip = (c: Player): Player => (c === "black" ? "white" : "black")


export type BoardStateDTO = {
    board: BoardDTO
    hands: {
        black: HandDTO
        white: HandDTO
    }
    turn: "black" | "white"
}
