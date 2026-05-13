import { Move, Piece, Position, Square, type PieceType } from "../entity";
import { canPromote } from "./promotion";

export function generateValidMovesFrom(
    position: Position,
    from: Square
): Move[] {
    const piece = position.board.get(from);

    if (!piece) return [];
    if (piece.owner !== position.sideToMove) return [];

    return generatePieceMoves(piece, from, position);
}

function generatePieceMoves(piece: Piece, from: Square, position: Position): Move[] {    
    switch (piece.type) {
        case "pawn":
            return generatePawnMoves(piece, from, position);
        case "lance":
            return generateLanceMoves(piece, from,  position);
        case "knight":
            return generateKnightMoves(piece, from, position);
        case "silver":
            return generateSilverMoves(piece, from, position);
        case "gold":
            return generateGoldMoves(piece, from, position);
        case "bishop":
            return generateBishopMoves(piece, from, position);
        case "rook":
            return generateRookMoves(piece, from, position);
        case "king":
            return generateKingMoves(piece, from, position);        
    }
}
function generateStepMoves(
    piece: Piece,
    from: Square,
    deltas: { x: number; y: number }[],
    position: Position
): Move[] {
    const moves: Move[] = [];

    for (const d of deltas) {        
        const to = Square.tryCreate(from.file + d.x, from.rank + d.y)        
        if (!to) continue
        const target = position.board.get(to);
        if (target && target.owner === piece.owner) continue;

        moves.push(...createMovesWithPromotion(piece, from, to, position));
    }

    return moves;
}
function generateSlidingMoves(
    piece: Piece,
    from: Square,
    directions: { x: number; y: number }[],
    position: Position
): Move[] {
    const moves: Move[] = [];

    for (const dir of directions) {
        let x = from.file + dir.x;
        let y = from.rank + dir.y;
        const sq = Square.create(x, y)

        while (isInside(Square.create(x, y))) {
            const to = Square.create(x, y)
            const target = position.board.get(to);

            if (target && target.owner === piece.owner) break;
            moves.push(...createMovesWithPromotion(piece, from, to, position));
            if (target) break; // 相手駒で止まる
            x += dir.x;
            y += dir.y;
        }
    }

    return moves;
}
function generatePawnMoves(piece: Piece, from: Square, position: Position): Move[] {
    if (piece.promoted) return generateGoldMoves(piece, from, position)
    const dir = piece.owner === "black" ? -1 : 1;
    return generateStepMoves(piece, from, [{ x: 0, y: dir }], position);
    
}
function generateKnightMoves(piece: Piece, from: Square, position: Position): Move[] {
    if (piece.promoted) return generateGoldMoves(piece, from, position)
    const dir = piece.owner === "black" ? -1 : 1;
    return generateStepMoves(
        piece, from,
        [
            { x: -1, y: 2 * dir },
            { x: 1, y: 2 * dir },
        ],
        position
    );
}
function generateSilverMoves(piece: Piece, from: Square, position: Position): Move[] {
    if (piece.promoted) return generateGoldMoves(piece, from, position)
    const dir = piece.owner === "black" ? -1 : 1;

    return generateStepMoves(
        piece, from,
        [
            { x: -1, y: dir },
            { x: 0, y: dir },
            { x: 1, y: dir },
            { x: -1, y: -dir },
            { x: 1, y: -dir },
        ],
        position
    );
}
function generateGoldMoves(piece: Piece, from: Square, position: Position): Move[] {
    const dir = piece.owner === "black" ? -1 : 1;

    return generateStepMoves(
        piece, from,
        [
            { x: -1, y: dir },
            { x: 0, y: dir },
            { x: 1, y: dir },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -dir },
        ],
        position
    );
}
function generateLanceMoves(piece: Piece, from: Square, position: Position): Move[] {
    if (piece.promoted) return generateGoldMoves(piece, from, position)
    const dir = piece.owner === "black" ? -1 : 1;

    return generateSlidingMoves(
        piece, from,
        [{ x: 0, y: dir }],
        position
    );
}
function generateBishopMoves(piece: Piece, from: Square, position: Position): Move[] {
    const moves = generateSlidingMoves(
        piece, from,
        [
            { x: 1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 },
        ],
        position
    );

    if (piece.promoted) {
        moves.push(
            ...generateStepMoves(
                piece, from,
                [
                    { x: 0, y: 1 },
                    { x: 0, y: -1 },
                    { x: 1, y: 0 },
                    { x: -1, y: 0 },
                ],
                position
            )
        );
    }

    return moves;
}
function generateRookMoves(piece: Piece, from: Square, position: Position): Move[] {
    const moves = generateSlidingMoves(
        piece, from,
        [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 },
        ],
        position
    );

    if (piece.promoted) {
        moves.push(
            ...generateStepMoves(
                piece, from,
                [
                    { x: 1, y: 1 },
                    { x: 1, y: -1 },
                    { x: -1, y: 1 },
                    { x: -1, y: -1 },
                ],
                position
            )
        );
    }

    return moves;
}

function generateKingMoves(piece: Piece, from: Square, position: Position): Move[] {
    return generateStepMoves(
        piece, from,
        [
            { x: 1, y: 1 },
            { x: 1, y: 0 },
            { x: 1, y: -1 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: 0 },
            { x: -1, y: -1 },
        ],
        position
    );
}
/////////////
function createMovesWithPromotion(
    piece: Piece,
    from: Square,
    to: Square,
    position: Position
): Move[] {
    // すでに成ってるなら不成のみ
    if (piece.promoted) {
        return [new Move(from, to, piece.type, false)];
    }

    if (!canPromote(from, to, piece)) {
        return [new Move(from, to, piece.type, false)];
    }

    return [
        new Move(from, to, piece.type, true),
        new Move(from, to, piece.type, false),
    ];
}
function isInside(square: Square): boolean {
  return (
    square.file >= 1 && square.file <= 9 &&
    square.rank >= 1 && square.rank <= 9
  );
}