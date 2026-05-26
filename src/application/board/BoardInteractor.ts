import { createDecideGameEventScope, decideGameEvent } from "@/domain/game/decideGameEvent"
import { resolveIntent } from "@/domain/game/intentResolver"
import type { Square } from "@/domain/kif/entity"
import type { BoardActions } from "@/ui/screens/player/hooks/usePlayerActions"
import type { BoardViewModel } from "@/ui/screens/player/hooks/usePlayerViewModel"

export class BoardInteractor {
    constructor(private deps: {
        boardModel: BoardViewModel
        actions: BoardActions
    }) { }

    handleSquareClick(square: Square) {
        const { position } = this.deps.boardModel
        const { sideToMove } = position

        const { clickSquare, promotionPending, clearSelection, dispatchGameEvent } =
            this.deps.actions

        const intent = clickSquare(square)
        if (!intent) return

        const intentResult = resolveIntent(position, intent)
        //const isUserTurn = sideToMove === userSide
        const scope = createDecideGameEventScope(sideToMove)
        const decision = decideGameEvent({
            intentResult,            
            scope,
        })

        switch (decision.type) {
            case "invalidMove":
                return
            case "promotionPending":
                promotionPending(decision.pendingPromotion)
                return
            case "event":
                dispatchGameEvent(decision.event)
                clearSelection()
                return
        }
    }
}