import { createDecideGameEventContext, decideGameEvent } from "@/domain/game/decideGameEvent"
import { resolveIntent } from "@/domain/game/intentResolver"
import type { Square } from "@/domain/kif/entity"
import type { BoardAction } from "@/ui/screens/player/runner/usePlayerRunner"
import type { BoardOKViewModel } from "@/ui/screens/player/vm/PlayerViewModel"

export class BoardInteractor {
    constructor(private deps: {
        boardModel: BoardOKViewModel
        actions: BoardAction
    }) { }

    handleSquareClick(square: Square) {
        const { position, userSide } = this.deps.boardModel
        const { sideToMove } = position

        const { clickSquare, promotionPending, clearSelection, dispatchGameEvent } =
            this.deps.actions

        const intent = clickSquare(square)
        if (!intent) return

        const intentResult = resolveIntent(position, intent)
        const isUserTurn = sideToMove === userSide

        const decision = decideGameEvent({
            intentResult,
            isUserTurn,
            ...createDecideGameEventContext()
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