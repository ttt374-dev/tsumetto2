import { createDecideGameEventContext, decideGameEvent } from "@/domain/game/decideGameEvent"
import type { IntentResult } from "@/domain/game/intentResolver"
import type { PieceType } from "@/domain/kif/entity"
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore"
import { useCurrentPosition, useGameStore } from "@/ui/screens/player/store/useGameStore"

type PromotionDialogResult = 
    | { status: "error"}
    | { status: "open", pieceType: PieceType, onConfirm: (promote: boolean) => void}
    | { status: "close", }

export function usePromotionDialog(): PromotionDialogResult {
    const { pendingPromotion } = useGameStore()        
    const { dispatch, choosePromotion } = useGameStore()    
    const clearSelection = useBoardInputStore(s=>s.clear)
    const userSide = useGameStore(s=>s.userSide)
    const res = useCurrentPosition()
    if (!res.ok) return { status: "error" }

    const position = res.value

    const onConfirm = (promote: boolean) => {
        const intentResult: IntentResult = { type: "move", move: choosePromotion(promote) }
        const ctx = createDecideGameEventContext()
        const isUserTurn = position.sideToMove === userSide
        const decision = decideGameEvent({ intentResult, isUserTurn, ...ctx })

        switch (decision.type) {
            case "invalidMove":
                return
            case "promotionPending":
                // ここに来たらバグ
                console.error("Unexpected promotionPending after confirm")
                return
            case "event":
                dispatch(decision.event)
                clearSelection()
                return
        }         
    }
    
    if (pendingPromotion){
        return {
            status: "open",            
            pieceType: pendingPromotion.pieceType,
            onConfirm,
        }
    } else {
        return { status: "close" }
    }    
}