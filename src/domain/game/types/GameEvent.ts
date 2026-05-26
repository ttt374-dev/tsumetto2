import type { PromotablePieceType, Square } from "@/domain/kif/entity"
import type { SessionId } from "@/domain/session/entity/Session"

export type GameEventBaseScope = {
    ply: number
    elapsedSec: number
    sessionId: SessionId | undefined
}

export type GameEvent =
    | ({ type: "SOLVE" } & GameEventBaseScope)
    | ({ type: "CORRECT" } & GameEventBaseScope)
    | ({ type: "MISTAKE" } & GameEventBaseScope)
    | ({ type: "REVEAL" } & GameEventBaseScope)
    | ({ type: "ABANDON" } & GameEventBaseScope)
    | ({type: "ADVANCE_PLY"} & GameEventBaseScope )
    | ({type: "RETREAT_PLY"} & GameEventBaseScope)
    | ({type: "MOVETO_PLY", to: number} & GameEventBaseScope)
    //| ({type: "ADVANCE_OPPONENT_PLY"} & BaseEvent )
    | ({type: "ADVANCE_TURN"} & GameEventBaseScope )
    | ({type: "REVEAL_HINT", hint: string} & GameEventBaseScope)
    
export type PendingPromotion = {
    from: Square
    to: Square
    pieceType: PromotablePieceType
}
