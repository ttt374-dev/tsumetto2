import { useEffect, useState } from "react"

import PlayerScreen from "../player/PlayerScreen"
import { useSessionPlayerViewModel } from "./hooks/useSessionPlayerViewModel"
import type { SolvedResult } from "@/domain/learning/entity/Learning"
import { SolvedDialog } from "../player/dialogs/SolvedDialog"
import type { Problem } from "@/domain/problem/entity/Problem"

////////////////////////////////////////////////
export default function SessionPlayerScreen() {
    const vm = useSessionPlayerViewModel()   

    if (vm.status !== "playing") return <>{vm.status}</>
    return (<SessionPlayerContent 
        problem={vm.problem}
        title={vm.title}
        onSubmitAnswer={vm.submitAnswer}
        onUndoLastAnswer={vm.undoLastAnswer}
        onNextProblem={vm.nextProblem}        
    />)
}

function SessionPlayerContent(props: {
    problem: Problem
    title: string
    onSubmitAnswer: (res: SolvedResult) => void
    onUndoLastAnswer: () => void
    onNextProblem: () => void
}) {
    const [solvedResult, setSolvedResult] = useState<SolvedResult | undefined>(undefined)

    useEffect(()=>{
        setSolvedResult(undefined)
    }, [props.problem.id])

    const handleResolved = (res: SolvedResult) => {
        props.onSubmitAnswer(res)
        setSolvedResult(res)
    }
    
    return (
        <>
            <PlayerScreen problem={props.problem}
                title={props.title}
                onResolved={handleResolved}
                onUndoLastAnswer={props.onUndoLastAnswer}
            />

            { solvedResult &&
            <SolvedDialog open={solvedResult !== undefined}
                onClose={() => setSolvedResult(undefined)}
                onConfirm={props.onNextProblem}
                solvedResult={solvedResult}
            />}
        </>
    )
}

