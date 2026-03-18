import { Square, type Move, type Piece, type PieceType, type Player, type Position } from "../entity"

export function isValidMove(position: Position, move: Move): boolean {
    if (!move.from) return isValidDrop(position, move)

    const piece = position.board.get(move.to)
    if (!piece) return false
    if (piece.owner !== position.sideToMove) return false
        

    // 行き先に自分の駒
    const target = position.board.get(move.to)
    if (target && target.owner === piece.owner) return false

    return isValidPieceMovement(position, piece, move.from, move.to)
}
export function isValidDrop(position: Position, move: Move): boolean {
    if (position.board.get(move.to)) return false
    
    return true
}
type ValidPieceType = PieceType | "horse" | "dragon"

function isValidPieceMovement(position: Position, piece: Piece, from: Square, to: Square): boolean {
    const dx = to.file - from.file
    const dy = to.rank - from.rank

    let validType: ValidPieceType = piece.type

    if (piece.promoted){
        switch (piece.type){
            case "pawn":
            case "lance":
            case "knight":
            case "silver":
                validType = "gold"
                break
            case "bishop":
                validType = "horse"
                break
            case "rook":
                validType = "dragon"
                break
        }
    }

    switch (validType) {
        case "pawn":
            return pawnMove(dx, dy, piece.owner)

        case "lance":
            return lanceMove(position, from, to, piece.owner)

        case "knight":
            return knightMove(dx, dy, piece.owner)

        case "silver":
            return silverMove(dx, dy, piece.owner)

        case "gold":
            return goldMove(dx, dy, piece.owner)

        case "bishop":
            return bishopMove(position, from, to)

        case "rook":
            return rookMove(position, from, to)

        case "king":
            //return kingMove(dx, dy)
            return true

        case "horse":
            return horseMove(position, from, to)

        case "dragon":
            return dragonMove(position, from, to)

        default:
            return false
    }
}

function pawnMove(dx: number, dy: number, player: Player) {
    if (player === "black")
        return dx === 0 && dy === -1
    else
        return dx === 0 && dy === 1
}
function knightMove(dx: number, dy: number, player: Player) {
    if (player === "black")
        return Math.abs(dx) === 1 && dy === -2
    else
        return Math.abs(dx) === 1 && dy === 2
}
function bishopMove(state: Position, from: Square, to: Square) {
    const dx = to.file - from.file
    const dy = to.rank - from.rank

    if (Math.abs(dx) !== Math.abs(dy))
        return false

    return isPathClear(state, from, to)
}
function rookMove(state: Position, from: Square, to: Square) {
    const dx = to.file - from.file
    const dy = to.rank - from.rank    
    
    if (dx !== 0 && dy !== 0)
        return false

    return isPathClear(state, from, to)
}
function horseMove(state: Position, from: Square, to: Square){
    if (bishopMove(state, from, to)) return true

    const dx = to.file - from.file
    const dy = to.rank - from.rank
    return (Math.abs(dx) === 1 && dy === 0) ||
        (dx === 0 && Math.abs(dy) === 1)     
}
function dragonMove(state: Position, from: Square, to: Square){
    if (rookMove(state, from, to)) return true

    const dx = to.file - from.file
    const dy = to.rank - from.rank
    return (Math.abs(dx) === 1 && Math.abs(dy) === 1)
}
function isPathClear(position: Position, from: Square, to: Square): boolean {

    const stepX = Math.sign(to.file - from.file)
    const stepY = Math.sign(to.rank - from.rank)

    let x = from.file + stepX
    let y = from.rank + stepY

    while (x !== to.file || y !== to.rank) {

        if (position.board.get(new Square(x, y)))
            return false

        x += stepX
        y += stepY
    }

    return true
}

function lanceMove(
  state: Position,
  from: Square,
  to: Square,
  player: Player
): boolean {

    const dx = to.file - from.file
    const dy = to.rank - from.rank    

  if (dx !== 0) return false

  if (player === "black" && dy >= 0) return false
  if (player === "white" && dy <= 0) return false

  return isPathClear(state, from, to)
}

function silverMove(
  dx: number,
  dy: number,
  player: Player
): boolean {

  if (player === "black") {
    return (
      (dx === 0 && dy === -1) ||
      (Math.abs(dx) === 1 && dy === -1) ||
      (Math.abs(dx) === 1 && dy === 1)
    )
  }

  return (
    (dx === 0 && dy === 1) ||
    (Math.abs(dx) === 1 && dy === 1) ||
    (Math.abs(dx) === 1 && dy === -1)
  )
}
function goldMove(
  dx: number,
  dy: number,
  player: Player
): boolean {

  if (player === "black") {
    return (
      (dx === 0 && dy === -1) ||
      (Math.abs(dx) === 1 && dy === -1) ||
      (Math.abs(dx) === 1 && dy === 0) ||
      (dx === 0 && dy === 1)
    )
  }

  return (
    (dx === 0 && dy === 1) ||
    (Math.abs(dx) === 1 && dy === 1) ||
    (Math.abs(dx) === 1 && dy === 0) ||
    (dx === 0 && dy === -1)
  )
}