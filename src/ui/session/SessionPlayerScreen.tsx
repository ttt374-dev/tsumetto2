import React, { useEffect, useState } from "react"

import PlayerScreen from "@/ui/player/PlayerScreen"
import { useSessionPlayerViewModel, type SessionPlayerPlayingVM } from "./hooks/useSessionPlayerViewModel"
import { PlayerFooterPanel } from "@/ui/player/components/panels/PlayerFooterPanel"
import { useGameStore, type GameEvent } from "@/ui/player/hooks/useGameStore"
import { useTimerStore } from "@/ui/player/hooks/useTimerStore"
import type { ReviewAction } from "@/domain/review/ReviewEvent"
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import { SessionProblemListDialog } from "@/ui/session/SessionProblemListDialog"
import { createPlayerContext } from "@/ui/player/components/types/PlayerContext"


////////////////////////////////////////////////
export default function SessionPlayerScreen() {
    const vm = useSessionPlayerViewModel()

    if (vm.status !== "playing") return <>{vm.status}</>
    if (!vm.sessionId) return <>NO SESSION ID</>

    return (<SessionPlayerContent vm={vm}/>)
}

function SessionPlayerContent({vm}: { vm: SessionPlayerPlayingVM}) {
    const { hasSubmitted, events, markSubmit, dispatch, state } = useGameStore()
    const [isListOpen, setIsListOpen] = useState(false)

    useEffect(() => {
        return () => {
            // 離脱直前に未サブミットなら強制 ABANDON + submit
            flush()
        }
    }, [vm.problem.id]) // 問題が切り替わるたびに発火
    // ハンドラー
    const handleShowList = () => {
        setIsListOpen(true)
    }      
    const handleNext = () => {    
        flush()
        vm.nextProblem()
        
    }
    const handleSolved = () => {        
        submitSolvedResult()
    }
    // サブミット    
    const submitSolvedResult = () => {
        if (hasSubmitted) return
        
        const res = deriveSolvedResultFromEvents(events) //deriveSolvedResult(state, timer.elapsedSec)
        const actions = toReviewActions(events)
        //console.log("submit solveresult", res, actions)
        vm.submitSolvedResult(res, actions)
        markSubmit()
    }
    const flush = () => {
        if (hasSubmitted) return  // サブミット済なら何もしない

        if (!state.isSolved) {   // もし解かれてなかった、諦めたと見なす
            //const ply = useReplayStore.getState().ply
            //alert("YOU GAVE UP")
            const { ply, elapsedSec} = createPlayerContext()
            dispatch({ type: "ABANDON", ply, elapsedSec })
        }
        submitSolvedResult()        
    }

    const footerPanel: React.ReactNode = (
        <PlayerFooterPanel
            onNext={handleNext}
            onShowList={handleShowList} />)
            
    return (
        <>
            <PlayerScreen
                problem={vm.problem}
                title={vm.title}
                onSolve={handleSolved}
                onSolvedConfirm={handleNext}
                onAfterDelete={vm.nextProblem}
                footerPanel={footerPanel}
            />

            <SessionProblemListDialog
                open={isListOpen}
                onClose={()=>setIsListOpen(false)}
            />

        </>
    )
}
////////////////
function toReviewActions(events: GameEvent[]): ReviewAction[] {
    return events.flatMap((e): ReviewAction[] => {
        switch (e.type) {
            case "MISTAKE":
                return [{ type: "mistake", ply: e.ply, elapsedSec: e.elapsedSec }]
            case "REVEAL":
                return [{ type: "reveal", ply: e.ply, elapsedSec: e.elapsedSec }]
            case "ABANDON":
                return [{ type: "abandon", ply: e.ply, elapsedSec: e.elapsedSec }]
            default:
                return []
        }
    })
}