import React, { useEffect, useRef, useState } from "react"

import PlayerScreen from "../player/PlayerScreen"
import { useSessionPlayerViewModel } from "./hooks/useSessionPlayerViewModel"
import { deriveSolvedResult, type SolvedResult } from "@/domain/learning/entity/Learning"
import { SolvedDialog } from "../player/dialogs/SolvedDialog"
import type { Problem } from "@/domain/problem/entity/Problem"
import { PlayerFooterPanel } from "@/ui/player/components/panels/PlayerFooterPanel"
import { useLocation, useNavigate } from "react-router-dom"
import { routes } from "@/ui/App/useAppNavigation"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { useGameStore, type GameEvent } from "@/ui/player/hooks/useGameStore"
import { useTimerStore } from "@/ui/player/hooks/useTimerStore"
import { useSessionStore } from "@/ui/session/hooks/useSessionStore"
import type { ReviewAction } from "@/domain/review/ReviewEvent"

///
function toReviewActions(events: GameEvent[]): ReviewAction[] {
  return events.flatMap((e): ReviewAction[] => {
    switch (e.type) {
      case "MISTAKE":
        return [{ type: "mistake", ply: e.ply, elapsedSec: e.elapsedSec }]
      case "REVEAL":
        return [{ type: "reveal", ply: e.ply }]
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
    //const [solvedResult, setSolvedResult] = useState<SolvedResult | undefined>(undefined)
    const navigate = useNavigate()
    const toast = useToast()    
    const summary = useSessionStore(s=>s.summary)
    const next = useSessionStore(s=>s.next)
    
    const timer = useTimerStore()
    const { state, hasSubmitted, markSubmit, event, events, clearEvent, finalize} = useGameStore()
    const solvedResult = isOpen
        ? deriveSolvedResult(state, timer.elapsedSec)
        : null
        
    // 初期化
    useEffect(() => {
        setIsOpen(false)
    }, [props.problem.id])

    // SOLV イベントでダイアログを表示
    useEffect(()=>{
        if (!event) return 
        if (event.type === "SOLVE"){
            setIsOpen(true)
        }
        clearEvent()
    })
    // on leave    
    // ハンドラー
    const handleShowList = () => {
        navigate(routes.sessionList)
    }
    const onLeave = () => {
        const s = finalize()
        console.log("finalized on lieave", s)
        if (!s) return
        submitSolvedResult()
        //("submit result")
        
    }    
    const handleNext = () => {    
        onLeave()
        props.onNextProblem()
    }
    const handleSummary = () => {
        onLeave()
        summary()
    }
    const handleSolved = () => {
        submitSolvedResult()
    }
    // サブミット    
    const submitSolvedResult = () => {
        console.log("submtsovelresult", hasSubmitted)
        if (hasSubmitted) return
        
        //const res = solvedResult || deriveSolvedResult(state, timer.elapsedSec)
        const res = deriveSolvedResult(state, timer.elapsedSec)
        const actions = toReviewActions(events)
        console.log("submit solveresult", actions)
        props.onSubmitAnswer(res, actions)
        toast({ message: `submit solved result: ${res.outcome}` })
        markSubmit()

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

