import React, { useEffect, useState } from "react"

import PlayerScreen from "../player/PlayerScreen"
import { useSessionPlayerViewModel } from "./hooks/useSessionPlayerViewModel"
import type { SolvedResult } from "@/domain/learning/entity/Learning"
import { SolvedDialog } from "../player/dialogs/SolvedDialog"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { PlayerFooterPanel } from "@/ui/player/components/panels/PlayerFooterPanel"
import { useNavigate } from "react-router-dom"
import { routes } from "@/ui/App/useAppNavigation"
import { useToast } from "@/ui/App/providers/ToastProvider"

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

    const handleResolved = (res: SolvedResult) => {
        if (props.onSubmitAnswer(res)) {
            setSolvedResult(res)
        } else {
            toast({ message: "solved but already submitted" })
        }
    }
    const handleShowList = () => {
        navigate(routes.sessionList)

    }
    const footerPanel: React.ReactNode = (<PlayerFooterPanel onShowList={handleShowList} />)
    return (
        <>
            <PlayerScreen
                problem={props.problem}
                title={props.title}
                onSolved={handleResolved}
                onUndoLastAnswer={props.onUndoLastAnswer}
                footerPanel={footerPanel}
            />

            {solvedResult &&
                <SolvedDialog open={solvedResult !== undefined}
                    onClose={() => setSolvedResult(undefined)}
                    onConfirm={props.onNextProblem}
                    solvedResult={solvedResult}
                />}
        </>
    )
}

