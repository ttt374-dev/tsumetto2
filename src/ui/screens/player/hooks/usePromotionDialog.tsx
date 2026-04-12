import { createDecideGameEventContext, decideGameEvent } from "@/domain/game/decideGameEvent"
import type { IntentResult } from "@/domain/game/intentResolver"
import PromotionDialog from "@/ui/screens/player/dialogs/PromotionDialog"
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore"
import { useCurrentPosition, useGameStore } from "@/ui/screens/player/store/useGameStore"

export function usePromotionDialog(){
    const { pendingPromotion } = useGameStore()        
    const { dispatch, choosePromotion } = useGameStore()    
    const clearSelection = useBoardInputStore(s=>s.clear)
    const userSide = useGameStore(s=>s.userSide)
    const position = useCurrentPosition()

    const onPromotionConfirm = (promote: boolean) => {
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
    const element = pendingPromotion && 
            <PromotionDialog 
                open={pendingPromotion !== null}
                pieceType={pendingPromotion.pieceType}
                onConfirm={onPromotionConfirm}
                onClose={() => {}}
                >
                </PromotionDialog>
    
    return { element }
}