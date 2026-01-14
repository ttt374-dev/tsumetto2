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
    readonly player: Player,
    readonly promoted: boolean = false
  ) { }

  demote(): Piece {
    return new Piece(this.type, this.player, false)
  }

  promote(): Piece {
    return new Piece(this.type, this.player, true)
  }
  ///////////////////////////////
  // seiralize
  toJSON(): PieceDTO {
    return {
      type: this.type,
      player: this.player,
      promoted: this.promoted,
    }

  }

  static fromJSON(dto: PieceDTO): Piece {
    return new Piece(dto.type, dto.player, dto.promoted)
  }
}

export type PieceDTO = {
  type: PieceType
  player: Player
  promoted: boolean
}
