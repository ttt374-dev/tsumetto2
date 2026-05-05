import type { PromotablePieceType, Square } from "@/domain/kif/entity"

type BaseEvent = {
    ply: number
    elapsedSec: number
}

export type GameEvent =
    | ({ type: "SOLVE" } & BaseEvent)
    | ({ type: "CORRECT" } & BaseEvent)
    | ({ type: "MISTAKE" } & BaseEvent)
    | ({ type: "REVEAL" } & BaseEvent)
    | ({ type: "ABANDON" } & BaseEvent)
    | ({type: "ADVANCE_PLY"} & BaseEvent )
    | ({type: "RETREAT_PLY"} & BaseEvent)
    | ({type: "MOVETO_PLY", to: number} & BaseEvent)
    //| ({type: "ADVANCE_OPPONENT_PLY"} & BaseEvent )
    | ({type: "ADVANCE_TURN"} & BaseEvent )
    
export type PendingPromotion = {
    from: Square
    to: Square
    pieceType: PromotablePieceType
}