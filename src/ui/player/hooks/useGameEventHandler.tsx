import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import type { SolvedResult } from "@/domain/review/solvedResult"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { createPlayerContext } from "@/ui/player/components/types/PlayerContext"
import { SolvedDialog } from "@/ui/player/dialogs/SolvedDialog"
import { useReplayController } from "@/ui/player/hooks/useReplayController"
import { useGameStore } from "@/ui/player/store/useGameStore"
import { useReplayStore } from "@/ui/player/store/useReplayStore"
import { useTimerStore } from "@/ui/player/store/useTimerStore"
import { useEffect, useState } from "react"

export function useGameEventHandler(isInitialized: boolean, 
    onSolve: () => void, onSolvedConfirm: () => void){
    const [isSolvedDialogOpen, setIsSolvedDialogOpen] = useState(false)
    const [solvedResult, setSolvedResult] = useState<SolvedResult|undefined>(undefined)
    const events = useGameStore(s=>s.events)    
    const gameState = useGameStore(s=>s.state)
    const replay = useReplayStore()
    const stopTimer = useTimerStore(s=>s.stop)
    const replayCtrl = useReplayController()
    const toast = useToast()

    useEffect(() => {
        if (!isInitialized) return   // 初期化前は無視
        const last = events.at(-1)
        if (!last) return

        switch (last.type) {
            case "SOLVE":        
                replay.advancePly()
                stopTimer()
                setIsSolvedDialogOpen(true)
                setSolvedResult(deriveSolvedResultFromEvents(events))
                onSolve?.()
                break        
            case "MISTAKE":
                toast({message: `mistake: ${gameState.mistakes}`})
                break;
            case "ADVANCE_TURN":
                replayCtrl.advanceTurn()
                break;
        }
    }, [events])

    const element = solvedResult &&
        <SolvedDialog open={isSolvedDialogOpen}
            onClose={() => setIsSolvedDialogOpen(false)}
            onConfirm={onSolvedConfirm}
            solvedResult={solvedResult}
        />

    return { element}
}

export function useRevealHandler(){
    const { dispatch } = useGameStore()            
    const ctx = createPlayerContext()  
    
    const onRevealAnswer = () => {
        dispatch({type: "REVEAL", ...ctx})
    }
    return { onRevealAnswer }
}