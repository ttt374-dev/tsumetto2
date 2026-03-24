import React, { useEffect, useState } from "react"

import PlayerScreen from "../player/PlayerScreen"
import { useSessionPlayerViewModel } from "./hooks/useSessionPlayerViewModel"
import { deriveSolvedResult, type SolvedResult } from "@/domain/learning/entity/Learning"
import { SolvedDialog } from "../player/dialogs/SolvedDialog"
import type { Problem } from "@/domain/problem/entity/Problem"
import { PlayerFooterPanel } from "@/ui/player/components/panels/PlayerFooterPanel"
import { useNavigate } from "react-router-dom"
import { routes } from "@/ui/App/useAppNavigation"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { useGameStore } from "@/ui/player/hooks/useGameStore"
import { useTimerStore } from "@/ui/player/hooks/useTimerStore"

////////////////////////////////////////////////
export default function SessionPlayerScreen() {
    const vm = useSessionPlayerViewModel()

    if (vm.status !== "playing") return <>{vm.status}</>
    if (!vm.sessionId) return <>NO SESSION ID</>

    const onUndoLastAnswer = vm.hasLastAnswer() ? vm.undoLastAnswer : undefined

    return (<SessionPlayerContent
        problem={vm.problem}
        title={vm.title}
        onSubmitAnswer={vm.submitAnswer}
        onUndoLastAnswer={onUndoLastAnswer}
        onNextProblem={vm.nextProblem}
    />)
}

function SessionPlayerContent(props: {
    problem: Problem
    title: string
    onSubmitAnswer: (res: SolvedResult) => boolean
    onUndoLastAnswer?: () => void
    onNextProblem: () => void
}) {
    const [solvedResult, setSolvedResult] = useState<SolvedResult | undefined>(undefined)
    const navigate = useNavigate()
    const toast = useToast()    

    useEffect(() => {
        setSolvedResult(undefined)
    }, [props.problem.id])

    const handleSolved = (res: SolvedResult) => {
        if (props.onSubmitAnswer(res)) {
            setSolvedResult(res)
        } else {
            toast({ message: "solved but already submitted" })
        }
    }

    const handleShowList = () => {
        navigate(routes.sessionList)
    }

    // 終了時サブミット
    const timer = useTimerStore()
    const { phase, state, hasSubmitted, markSubmit, event, clearEvent, finalize} = useGameStore()
    
    const submitSolvedResult = () => {
        if (!hasSubmitted){
            const res = deriveSolvedResult(state, timer.elapsedSec)
            props.onSubmitAnswer(res)
            console.log("submit result", res)
            markSubmit()
        }        
    }
    const handleNext = () => {    
        const s = finalize()
        if (!s) return

        submitSolvedResult()
        props.onNextProblem()
    }
    // SOLV イベントでダイアログを表示し
    useEffect(()=>{
        if (!event) return 
        if (event.type === "SOLV"){
            const res = deriveSolvedResult(state, timer.elapsedSec)
            setSolvedResult(res)
        }
        clearEvent()
    })

    const footerPanel: React.ReactNode = (<PlayerFooterPanel onNext={handleNext} onShowList={handleShowList} />)
    return (
        <>
            <PlayerScreen
                problem={props.problem}
                title={props.title}
                onSolved={handleSolved}
                onUndoLastAnswer={props.onUndoLastAnswer}
                footerPanel={footerPanel}
            />

            {solvedResult &&
                <SolvedDialog open={solvedResult !== undefined}
                    onClose={() => setSolvedResult(undefined)}
                    onConfirm={handleNext}
                    solvedResult={solvedResult}
                />}
        </>
    )
}

