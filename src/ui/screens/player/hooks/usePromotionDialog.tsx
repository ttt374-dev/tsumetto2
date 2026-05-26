import { createDecideGameEventScope, decideGameEvent } from "@/domain/game/decideGameEvent"
import type { IntentResult } from "@/domain/game/intentResolver"
import type { PieceType, PromotablePieceType } from "@/domain/kif/entity"
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore"
import { useCurrentPosition, useGameStore } from "@/ui/screens/player/store/useGameStore"
import { useGameUIStore } from "@/ui/screens/player/store/useGameUIStore"

type PromotionDialogResult = 
    | { open: true, pieceType: PromotablePieceType, onConfirm: (promote: boolean) => void}
    | { open: false }

export function usePromotionDialog(): PromotionDialogResult {
    const { dispatch, choosePromotion, pendingPromotion } = useGameStore()    
    const userSide = useGameUIStore(s=>s.userSide)
    const clearSelection = useBoardInputStore(s=>s.clear)
    
    const res = useCurrentPosition()
    if (!res.ok) return { open: false }

    const position = res.value

    const onConfirm = (promote: boolean) => {
        const intentResult: IntentResult = { type: "move", move: choosePromotion(promote) }
        const scope = createDecideGameEventScope(position.sideToMove)
        //const isUserTurn = position.sideToMove === userSide
        const decision = decideGameEvent({ intentResult, scope })

        switch (decision.type) {
            case "invalidMove":
                return
            case "promotionPending":
                // ここに来たらバグ
                throw new Error("Unexpected promotionPending after confirm")
            case "event":
                dispatch(decision.event)
                clearSelection()
                return
        }         
    }
    
    if (pendingPromotion){
        return {
            open: true,        
            pieceType: pendingPromotion.pieceType,
            onConfirm,
        }
    } else {
        return { open: false }
    }    
}