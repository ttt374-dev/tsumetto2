export type Player = "black" | "white"
export type PieceType = "pawn" | "bishop" | "knight" | "silver" | "gold" | "bishop" | "rook" | "king"

//export class Square {
//  constructor(readonly file: number, readonly rank: number) { }
//}
export type Square = {
  file: number, rank: number,
}

export class Piece {
  constructor(
    readonly type: PieceType,
    readonly owner: Player,
    readonly promoted: boolean = false
  ) { }

  demote(): Piece {
    return new Piece(this.type, this.owner, false)
  }

  promote(): Piece {
    return new Piece(this.type, this.owner, true)
  }
  ///////////////////////////////
  // seiralize
  toJSON(): PieceDTO {
    return {
      type: this.type,
      owner: this.owner,
      promoted: this.promoted,
    }

  }

  static fromJSON(dto: PieceDTO): Piece {
    return new Piece(dto.type, dto.owner, dto.promoted)
  }
}

export type PieceDTO = {
  type: PieceType
  owner: Player
  promoted: boolean
}
