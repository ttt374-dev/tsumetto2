import React, { useEffect, useRef, useState } from "react"

import PlayerScreen from "../player/PlayerScreen"
import { useSessionPlayerViewModel, type SessionPlayerPlayingVM } from "./hooks/useSessionPlayerViewModel"
import { SolvedDialog } from "../player/dialogs/SolvedDialog"
import type { Problem } from "@/domain/problem/entity/Problem"
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

///
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
////////////////////////////////////////////////
export default function SessionPlayerScreen() {
    const vm = useSessionPlayerViewModel()

    if (vm.status !== "playing") return <>{vm.status}</>
    if (!vm.sessionId) return <>NO SESSION ID</>

    return (<SessionPlayerContent vm={vm}/>)
}

function SessionPlayerContent({vm}: {
    vm: SessionPlayerPlayingVM
}) {
    const [isOpen, setIsOpen ] = useState(false)
    const [solvedResult, setSolvedResult] = useState<SolvedResult | undefined>(undefined)
    const navigate = useNavigate()
    const next = useSessionStore(s=>s.next)    
    const timer = useTimerStore()
    const { hasSubmitted, events, markSubmit, dispatch } = useGameStore()
        
    // 初期化
    useEffect(() => {
        setIsOpen(false)
    }, [vm.problem.id])
    const prevLenRef = useRef(0)

    useEffect(() => {
        const newEvents = events.slice(prevLenRef.current)

        newEvents.forEach(e => {
            switch (e.type) {
                case "SOLVE":
                    setIsOpen(true)
                    setSolvedResult(deriveSolvedResultFromEvents(events))
                    break                
            }
        })

        prevLenRef.current = events.length
    }, [events])

    // ハンドラー
    const handleShowList = () => {
        navigate(routes.sessionList)
    }      
    const handleNext = () => {    
        flush()
        //onLeave()
        vm.nextProblem
    }/*
    const handleSummary = () => {
        flush()
        //onLeave()
        summary()
    }*/
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
        if (hasSubmitted) return

        const ply = useReplayStore.getState().ply
        dispatch({type: "ABANDON", ply, elapsedSec: timer.elapsedSec})
        //controller.markAbandon(timer.elapsedSec)
        
        //markAbandon(timer.elapsedSec)
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
                onSolved={handleSolved}
                //onUndoLastAnswer={props.onUndoLastAnswer}
                onAfterDelete={next}
                footerPanel={footerPanel}
            />

            {solvedResult &&
                <SolvedDialog open={isOpen}
                    onClose={() => setIsOpen(false)}
                    onConfirm={handleNext}
                    solvedResult={solvedResult}
                />}
        </>
    )
}