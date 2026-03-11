import { Move, Position, type PieceType, type Square } from "@/domain/kif/entity";
import { canPromote } from "@/domain/kif/rules";
import type { SelectedState } from "../../hooks/useBoardInputStore";

export type MoveIntent =
    | { type: "select"; square: Square }
    | { type: "cancel" }
    | { type: "move"; move: Move; promotable: boolean }

export function createMoveIntent(
    position: Position,
    selectedState: SelectedState,
    file: number,
    rank: number
): MoveIntent {

    switch (selectedState.type) {

        case "idle": {
            const piece = position.board.get(file, rank)
            if (!piece || piece.owner !== position.turn) {
                return { type: "cancel" }
            }
            return { type: "select", square: { file, rank } }
        }

        case "selected": {

            let from: Square | null = null
            let pieceType: PieceType
            let promoted = false

            switch (selectedState.source) {

                case "board": {
                    from = selectedState.square

                    if (from.file === file && from.rank === rank) {
                        return { type: "cancel" }
                    }

                    const piece = position.board.get(from.file, from.rank)
                    if (!piece) throw new Error("piece missing")

                    pieceType = piece.type
                    promoted = piece.promoted
                    break
                }

                case "hand": {
                    pieceType = selectedState.pieceType
                    break
                }
            }

            const move = new Move(from, { file, rank }, pieceType, promoted)

            return {
                type: "move",
                move,
                promotable: !promoted && canPromote(move, position.turn)
            }
        }
    }
}