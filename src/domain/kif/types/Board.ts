export type Handicap = "平手" | "二枚落ち" | "四枚落ち"

import { Piece, Square, type PieceDTO, type Player } from "./Piece"

type SquareGrid = Map<string, Piece | null>

function locateEvenMatch(squares: Square, player: Player){
  

}

export class Board {
  constructor(
    private readonly squares: Map<string, Piece | null>
  ) {}

  static empty(): Board {    
    return new Board(this.createEmptySquares())
  }
  static create(handicap: Handicap = "平手"){
    const squares = this.createEmptySquares()
      // 平手用の初期駒配置
    if (handicap === "平手") {
      // 先手の駒
      
      squares.set("2,8", new Piece("bishop", "black"))
      squares.set("8,8", new Piece("rook", "black"))
      
      for (let i = 1; i<=9; i++){
        squares.set(`${i},7`, new Piece("pawn", "black"))
      }
      
      squares.set("1,9", new Piece("lance", "black"))
      squares.set("2,9", new Piece("knight", "black"))
      squares.set("3,9", new Piece("silver", "black"))
      squares.set("4,9", new Piece("gold", "black"))
      squares.set("5,9", new Piece("king", "black"))
      squares.set("6,9", new Piece("gold", "black"))
      squares.set("7,9", new Piece("silver", "black"))
      squares.set("8,9", new Piece("knight", "black"))
      squares.set("9,9", new Piece("lance", "black"))
      
      // 後手の駒（色 white）
            squares.set("2,8", new Piece("bishop", "black"))
      squares.set("8,8", new Piece("rook", "black"))
      
      for (let i = 1; i<=9; i++){
        squares.set(`${i},3`, new Piece("pawn", "black"))
      }
      
      squares.set("1,1", new Piece("lance", "black"))
      squares.set("2,1", new Piece("knight", "black"))
      squares.set("3,1", new Piece("silver", "black"))
      squares.set("4,1", new Piece("gold", "black"))
      squares.set("5,1", new Piece("king", "black"))
      squares.set("6,1", new Piece("gold", "black"))
      squares.set("7,1", new Piece("silver", "black"))
      squares.set("8,1", new Piece("knight", "black"))
      squares.set("9,1", new Piece("lance", "black"))     
 
    }
    return new Board(squares)
  }

  ////
  get(sq: Square): Piece | null {
    return this.squares.get(sq.key) ?? null
  }

  set(sq: Square, piece: Piece | null): Board {
    const next = new Map(this.squares)
    next.set(sq.key, piece)
    return new Board(next)
  }
  //
    dump() {
        for (let r = 1; r <= 9; r++) {
            for (let f = 1; f <= 9; f++) {
                const piece = this.get(Square.create(f, r))
                console.log(`${f},${r}: ${piece?.type}`)
            }


        }
    }
    ///////////////////////
  // private static
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

