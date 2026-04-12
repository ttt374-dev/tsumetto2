import type { Problem } from "@/domain/problem/entity/Problem"
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import type { SolvedResult } from "@/domain/review/solvedResult"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { createPlayerContext } from "@/ui/screens/player/components/types/PlayerContext"
import { SolvedDialog } from "@/ui/screens/player/dialogs/SolvedDialog"
import { useReplayController } from "@/ui/screens/player/hooks/useReplayController"
import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import { useReplayStore } from "@/ui/screens/player/store/useReplayStore"
import { useTimerStore } from "@/ui/screens/player/store/useTimerStore"
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore"
import { useEffect, useState } from "react"
import type { LearningState } from "@/domain/learning/entity/LearningState"

export function useGameEventHandler(problem: Problem, 
    onSolve: () => void, onSolvedConfirm: () => void){
    const [isSolvedDialogOpen, setIsSolvedDialogOpen] = useState(false)
    const [solvedResult, setSolvedResult] = useState<SolvedResult|undefined>(undefined)
    const events = useGameStore(s=>s.events)    
    const gameState = useGameStore(s=>s.state)
    const replay = useReplayStore()
    const stopTimer = useTimerStore(s=>s.stop)
    const replayCtrl = useReplayController()    
    const records = useLearningRecordStore(s=>s.stateRecords)    
    const learning = records[problem.id]
    
    const toast = useToast()
  
    // 初期化処理
    const [isInitialized, setIsInitialized] = useState(false)

    const initializeGame = useGameStore(s=>s.initialize)
    const initializeReplay = useReplayStore(s=>s.initialize)
    const restart = useTimerStore(s=>s.restart)
    
    useEffect(()=>{                
        setIsInitialized(false)
        initializeGame(problem.kifData.initialPosition, problem.kifData.moves)      
        initializeReplay(problem.kifData.moves.length)
        restart()        
        setIsInitialized(true)
    }, [problem.id])

    // イベント処理
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
            case "ADVANCE_PLY":
                replay.advancePly()
                break;
            case "ADVANCE_OPPONENT_PLY":
                replayCtrl.advanceOpponentPly()
                break
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
            learning={learning}
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