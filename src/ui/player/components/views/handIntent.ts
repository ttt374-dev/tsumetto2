import { Move, Position, type PieceType, type Player, type Square } from "@/domain/kif/entity";
import type { SelectedState } from "../../hooks/useBoardInputStore";

export type HandIntent =
    | { type: "select"; pieceType: PieceType }
    | { type: "cancel" }
    | { type: "none" }

export function createHandIntent(
    selectedState: SelectedState,
    pieceType: PieceType,
    owner: Player,
    player: Player
): HandIntent {

    if (player !== owner) {
        return { type: "none" }
    }

    switch (selectedState.type) {

        case "idle":
            return { type: "select", pieceType }

        case "selected":

            if (
                selectedState.source === "hand" &&
                selectedState.pieceType === pieceType
            ) {
                return { type: "cancel" }
            }

            return { type: "none" }
    }
}