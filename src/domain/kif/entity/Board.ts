import { Piece, type PieceDTO, type Player } from "./Piece"
import { Square } from "./Square"

export type Handicap = "平手" | "二枚落ち" | "四枚落ち"
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
    get(sq: Square): Piece | null {
        return this.squares.get(Board.squareKey(sq)) ?? null
    }

    set(sq: Square, piece: Piece | null): Board {
        const next = new Map(this.squares)
        next.set(Board.squareKey(sq), piece)
        return new Board(next)
    }
    //
    dump() {
        for (let rank = 1; rank <= 9; rank++) {
            for (let file = 1; file <= 9; file++) {
                const piece = this.get(Square.create(file, rank))
                if (!piece) continue
                console.log(`${file},${rank}: ${piece?.type} (${piece?.owner})`)
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
        //const m = player === "black" ? 8 : 2
        const b = player === "black" ? 9 : 1

        

        // upper rank
        for (let i = 1; i <= 9; i++) {
            squares.set(`${i},${u}`, Piece.create("pawn", player))
        }
        // middle rank        
        if (player === "black"){
            squares.set(`8,8`, Piece.create("bishop", player))
            squares.set(`2,8`, Piece.create("rook", player))
        } else {
            squares.set(`2,2`, Piece.create("bishop", player))
            squares.set(`8,2`, Piece.create("rook", player))
        }

        // bottom rank
        squares.set(`1,${b}`, Piece.create("lance", player))
        squares.set(`2,${b}`, Piece.create("knight", player))
        squares.set(`3,${b}`, Piece.create("silver", player))
        squares.set(`4,${b}`, Piece.create("gold", player))
        squares.set(`5,${b}`, Piece.create("king", player))
        squares.set(`6,${b}`, Piece.create("gold", player))
        squares.set(`7,${b}`, Piece.create("silver", player))
        squares.set(`8,${b}`, Piece.create("knight", player))
        squares.set(`9,${b}`, Piece.create("lance", player))
    }
    static squareKey(sq: Square): string {
        return `${sq.file},${sq.rank}`
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

