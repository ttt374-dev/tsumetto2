import React, { useEffect, useRef, useState } from "react"

import PlayerScreen from "../player/PlayerScreen"
import { useSessionPlayerViewModel, type SessionPlayerPlayingVM } from "./hooks/useSessionPlayerViewModel"
import { SolvedDialog } from "../player/dialogs/SolvedDialog"
import { PlayerFooterPanel } from "@/ui/player/components/panels/PlayerFooterPanel"
import { useNavigate } from "react-router-dom"
import { routes } from "@/ui/App/useAppNavigation"
import { useGameStore, type GameEvent } from "@/ui/player/hooks/useGameStore"
import { useTimerStore } from "@/ui/player/hooks/useTimerStore"
import { useSessionStore } from "@/ui/session/hooks/useSessionStore"
import type { ReviewAction } from "@/domain/review/ReviewEvent"
import type { SolvedResult } from "@/domain/review/solvedResult"
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import { useReplayStore } from "@/ui/player/hooks/useReplayStore"


////////////////////////////////////////////////
export default function SessionPlayerScreen() {
    const vm = useSessionPlayerViewModel()

    if (vm.status !== "playing") return <>{vm.status}</>
    if (!vm.sessionId) return <>NO SESSION ID</>

    return (<SessionPlayerContent vm={vm}/>)
}

function SessionPlayerContent({vm}: { vm: SessionPlayerPlayingVM}) {
    const navigate = useNavigate()
    const timer = useTimerStore()
    const { hasSubmitted, events, markSubmit, dispatch, state } = useGameStore()

    useEffect(() => {

        return () => {
            // 離脱直前に未サブミットなら強制 ABANDON + submit
            if (!hasSubmitted) {
                flush()

            }
        }
    }, [vm.problem.id]) // 問題が切り替わるたびに発火
    // ハンドラー
    const handleShowList = () => {
        navigate(routes.sessionList)
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
        if (!state.isSolved) {   // もし解かれてなかった、諦めたと見なす
            const ply = useReplayStore.getState().ply
            alert("YOU GAVE UP")
            dispatch({ type: "ABANDON", ply, elapsedSec: timer.elapsedSec })
        }
        submitSolvedResult()        
    }

    const footerPanel: React.ReactNode = (
        <PlayerFooterPanel
            onNext={handleNext}
            //onSummary={handleSummary}
            onShowList={handleShowList} />)
            
    return (
        <>
            <PlayerScreen
                problem={vm.problem}
                title={vm.title}
                onSolve={handleSolved}
                onSolvedConfirm={handleNext}
                //onUndoLastAnswer={props.onUndoLastAnswer}
                onAfterDelete={vm.nextProblem}
                footerPanel={footerPanel}
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