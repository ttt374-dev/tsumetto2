export type Handicap = "平手" | "二枚落ち" | "四枚落ち"

import { Piece, Square, type PieceDTO, type Player } from "./Piece"

type SquareGrid = Map<string, Piece | null>

export class Board {
    constructor(
        private readonly squares: SquareGrid
    ) { }

    static empty(): Board {
        return new Board(this.createEmptySquares())
    }
    static create(handicap: Handicap = "平手") {
        const squares = this.createEmptySquares()
        // 平手用の初期駒配置
        if (handicap === "平手") {
            this.locateEvenMatch(squares, "black")
            this.locateEvenMatch(squares, "white")
        }
        return new Board(squares)
    }

    ////
    get(file: number, rank: number): Piece | null {
        return this.squares.get(Board.squareKey(file, rank)) ?? null
    }

    set(file: number, rank: number, piece: Piece | null): Board {
        const next = new Map(this.squares)
        next.set(Board.squareKey(file, rank), piece)
        return new Board(next)
    }
    //
    dump() {
        for (let r = 1; r <= 9; r++) {
            for (let f = 1; f <= 9; f++) {
                const piece = this.get(f, r)
                console.log(`${f},${r}: ${piece?.type}`)
            }
        }
    }
    ///////////////////////
    // static
    private static createEmptySquares() {
        const squares = new Map<string, Piece | null>()

        // 全マスを null で初期化
        for (let rank = 1; rank <= 9; rank++) {
            for (let file = 1; file <= 9; file++) {
                squares.set(`${file},${rank}`, null)
            }
        }
        return squares
    }
    private static locateEvenMatch(squares: SquareGrid, player: Player) {
        const u = player === "black" ? 7 : 3
        const m = player === "black" ? 8 : 2
        const b = player === "black" ? 9 : 1

        // upper rank
        for (let i = 1; i <= 9; i++) {
            squares.set(`${i},${u}`, new Piece("pawn", player))
        }
        // middle rank        
        squares.set(`2,${m}`, new Piece("bishop", player))
        squares.set(`8,${m}`, new Piece("rook", player))

        // bottom rank
        squares.set(`1,${b}`, new Piece("lance", player))
        squares.set(`2,${b}`, new Piece("knight", player))
        squares.set(`3,${b}`, new Piece("silver", player))
        squares.set(`4,${b}`, new Piece("gold", player))
        squares.set(`5,${b}`, new Piece("king", player))
        squares.set(`6,${b}`, new Piece("gold", player))
        squares.set(`7,${b}`, new Piece("silver", player))
        squares.set(`8,${b}`, new Piece("knight", player))
        squares.set(`9,${b}`, new Piece("lance", player))
    }
    static squareKey(file: number, rank: number): string {
        return `${file},${rank}`
    }
    ////////////////////////////
    // serialize
    toDTO(): BoardDTO {
        const squares = []

        for (const [key, piece] of this.squares.entries()) {
            const [file, rank] = key.split(",").map(Number)
            squares.push({
                file,
                rank,
                piece: piece ? piece.toDTO() : null,
            })
        }

        return { squares }
    }

    static fromDTO(dto: BoardDTO): Board {
        const map = new Map<string, Piece | null>()

        for (const { file, rank, piece } of dto.squares) {
            map.set(
                `${file},${rank}`,
                piece ? Piece.fromDTO(piece) : null
            )
        }

        return new Board(map)
    }
}

export type BoardDTO = {
    squares: Array<{
        file: number
        rank: number
        piece: PieceDTO | null
    }>
}

