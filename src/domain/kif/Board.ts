import { Piece, type PieceDTO, type PieceType, type Square } from "./Piece"

export class Board {
  constructor(
    private readonly squares: Map<string, Piece | null>
  ) {}

  static empty(): Board {
    const squares = new Map<string, Piece | null>()

    // 全マスを null で初期化
    for (let rank = 1; rank <= 9; rank++) {
      for (let file = 1; file <= 9; file++) {
        squares.set(`${file},${rank}`, null)
      }
    }
    return new Board(squares)
  }
  get(sq: Square): Piece | null {
    return this.squares.get(key(sq)) ?? null
  }

  set(sq: Square, piece: Piece | null): Board {
    const next = new Map(this.squares)
    next.set(key(sq), piece)
    return new Board(next)
  }
  ////////////////////////////
  // serialize
  toJSON(): BoardDTO {
    const squares = []

    for (const [key, piece] of this.squares.entries()) {
      const [file, rank] = key.split(",").map(Number)
      squares.push({
        file,
        rank,
        piece: piece ? piece.toJSON() : null,
      })
    }

    return { squares }
  }

  static fromJSON(dto: BoardDTO): Board {
    const map = new Map<string, Piece | null>()

    for (const { file, rank, piece } of dto.squares) {
      map.set(
        `${file},${rank}`,
        piece ? Piece.fromJSON(piece) : null
      )
    }

    return new Board(map)
  }
}
const key = (sq: Square) => `${sq.file},${sq.rank}`


export type BoardDTO = {
  squares: Array<{
    file: number
    rank: number
    piece: PieceDTO | null
  }>
}

