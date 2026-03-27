import React, { useEffect, useRef, useState } from "react"

import PlayerScreen from "../player/PlayerScreen"
import { useSessionPlayerViewModel } from "./hooks/useSessionPlayerViewModel"
import { SolvedDialog } from "../player/dialogs/SolvedDialog"
import type { Problem } from "@/domain/problem/entity/Problem"
import { PlayerFooterPanel } from "@/ui/player/components/panels/PlayerFooterPanel"
import { useNavigate } from "react-router-dom"
import { routes } from "@/ui/App/useAppNavigation"
import { useToast } from "@/ui/App/providers/ToastProvider"
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

    //const onUndoLastAnswer = vm.hasLastAnswer() ? vm.undoLastAnswer : undefined

    return (<SessionPlayerContent
        problem={vm.problem}
        title={vm.title}
        onSubmitAnswer={vm.submitAnswer}
        //onUndoLastAnswer={onUndoLastAnswer}
        onNextProblem={vm.nextProblem}
    />)
}

function SessionPlayerContent(props: {
    problem: Problem
    title: string
    onSubmitAnswer: (res: SolvedResult, actions: ReviewAction[]) => boolean
    onUndoLastAnswer?: () => void
    onNextProblem: () => void
}) {
    const [isOpen, setIsOpen ] = useState(false)
    const [solvedResult, setSolvedResult] = useState<SolvedResult | undefined>(undefined)
    const navigate = useNavigate()
    const summary = useSessionStore(s=>s.summary)
    const next = useSessionStore(s=>s.next)    
    const timer = useTimerStore()
    const { hasSubmitted, events, 
        markSubmit, markAbandon } = useGameStore()
    const ply = useReplayStore(s=>s.ply)
        
    // 初期化
    useEffect(() => {
        setIsOpen(false)
    }, [props.problem.id])
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
        props.onNextProblem()
    }
    const handleSummary = () => {
        flush()
        //onLeave()
        summary()
    }
    const handleSolved = () => {
        submitSolvedResult()
    }
    // サブミット    
    const submitSolvedResult = () => {
        //console.log("submtsovelresult", hasSubmitted)
        if (hasSubmitted) return
        
        //const res = solvedResult || deriveSolvedResult(state, timer.elapsedSec)
        const res = deriveSolvedResultFromEvents(events) //deriveSolvedResult(state, timer.elapsedSec)
        const actions = toReviewActions(events)
        console.log("submit solveresult", res, actions)
        props.onSubmitAnswer(res, actions)
        //toast({ message: `submit solved result: ${res.outcome}` })
        markSubmit()

    }
    const flush = () => {
        if (hasSubmitted) return

        markAbandon({ ply, elapsedSec: timer.elapsedSec})
        //markAbandon(timer.elapsedSec)
        submitSolvedResult()        
    }

    const footerPanel: React.ReactNode = (
        <PlayerFooterPanel 
            onNext={handleNext}
            onSummary={handleSummary}
            onShowList={handleShowList} />)
    return (
        <>
            <PlayerScreen
                problem={props.problem}
                title={props.title}
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

