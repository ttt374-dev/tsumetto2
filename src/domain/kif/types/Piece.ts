export type Player = "black" | "white"
export type PieceType = "pawn" | "lance" | "knight" | "silver" | "gold" | "bishop" | "rook" | "king"

export function displayPiece(piece: Piece): string{
  const baseMapping = {
    pawn: "歩", lance: "香", knight: "桂", silver: "銀", gold: "金", bishop: "角", rook: "飛", king: "玉"
  }
  const promotedMapping = {
    pawn: "と", lance: "杏", knight: "圭", silver: "全", gold: "金", bishop: "馬", rook: "龍", king: "玉"
  }

  return piece.promoted ? promotedMapping[piece.type] : baseMapping[piece.type]

}
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
