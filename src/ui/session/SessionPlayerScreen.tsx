import React, { useEffect, useState } from "react"

import PlayerScreen from "../player/PlayerScreen"
import { useSessionPlayerViewModel } from "./hooks/useSessionPlayerViewModel"
import type { SolvedResult } from "@/domain/learning/entity/Learning"
import { SolvedDialog } from "../player/dialogs/SolvedDialog"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { PlayerFooterPanel } from "@/ui/player/components/panels/PlayerFooterPanel"
import type { SessionId } from "@/domain/session/entity/Session"
import { SessionListBottomSheet } from "@/ui/session/SessionListBottomSheet"

////////////////////////////////////////////////
export default function SessionPlayerScreen() {
    const vm = useSessionPlayerViewModel()   
    
    if (vm.status !== "playing") return <>{vm.status}</>
    if (!vm.sessionId) return <>NO SESSION ID</>

    const onUndoLastAnswer = vm.hasLastAnswer() ? vm.undoLastAnswer : undefined
    return (<SessionPlayerContent 
        problem={vm.problem}
        title={vm.title}
        sessionProblemIds={vm.problemIds}
        onSubmitAnswer={vm.submitAnswer}
        onUndoLastAnswer={onUndoLastAnswer}
        onNextProblem={vm.nextProblem}    
        onMoveToProblemId={vm.moveToProblemId}    
        sessionId={vm.sessionId}
    />)
}

function SessionPlayerContent(props: {
    problem: Problem
    title: string
    sessionProblemIds: ProblemId[]
    onSubmitAnswer: (res: SolvedResult) => void
    onUndoLastAnswer?: () => void
    onNextProblem: () => void
    onMoveToProblemId: (id: ProblemId) => void
    sessionId: SessionId
}) {
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)
    const [solvedResult, setSolvedResult] = useState<SolvedResult | undefined>(undefined)

    useEffect(()=>{
        setSolvedResult(undefined)
    }, [props.problem.id])

    const handleResolved = (res: SolvedResult) => {
        props.onSubmitAnswer(res)
        setSolvedResult(res)
    }
    const handleShowList = () => {
        setIsBottomSheetOpen(true)
    }
    const footerPanel: React.ReactNode = (<PlayerFooterPanel onShowList={handleShowList}/>)    
    return (
        <>
            <PlayerScreen problem={props.problem}
                title={props.title}
                onSolved={handleResolved}
                onUndoLastAnswer={props.onUndoLastAnswer}
                footerPanel={footerPanel}
            />

            { solvedResult &&
            <SolvedDialog open={solvedResult !== undefined}
                onClose={() => setSolvedResult(undefined)}
                onConfirm={props.onNextProblem}
                solvedResult={solvedResult}
            />}

            <SessionListBottomSheet
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                problem={props.problem}
                sessionId={props.sessionId}
                sessionProblemIds={props.sessionProblemIds}
                onMoveToProblemId={props.onMoveToProblemId}                
            />
        </>
    )
}

