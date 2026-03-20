import React, { useEffect, useState } from "react"

import PlayerScreen from "../player/PlayerScreen"
import { useSessionPlayerViewModel } from "./hooks/useSessionPlayerViewModel"
import type { SolvedResult } from "@/domain/learning/entity/Learning"
import { SolvedDialog } from "../player/dialogs/SolvedDialog"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { Box, Drawer, Stack } from "@mui/material"
import { ListView } from "@/ui/list/ListView"
import { PlayerFooterPanel } from "@/ui/player/components/panels/PlayerFooterPanel"
import { problemTypeOptions } from "@/ui/detail/components/ProblemTypeSelect"
import { SessionListView } from "@/ui/session/SessionListView"
import type { SessionId } from "@/domain/session/entity/Session"

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


export function SessionListBottomSheet(props: {
    isOpen: boolean
    onClose: () => void
    problem: Problem
    sessionId: SessionId
    onMoveToProblemId: (id: ProblemId) => void
    sessionProblemIds: ProblemId[]
}){
    
    return (
        <Drawer anchor="bottom" open={props.isOpen}
                onClose={props.onClose}
            >
                <Stack spacing={2} p={1}
                    sx={{
                        pt: "calc(env(safe-area-inset-top) + 16px)",
                        pb: "calc(env(safe-area-inset-bottom) + 16px)"
                    }}
                >
                    <Box>ミッション対象問題リスト</Box>
                    <SessionListView ids={props.sessionProblemIds}
                        onSelect={(id)=>{
                            props.onMoveToProblemId(id)
                            props.onClose()
                        }}
                        selectedId={props.problem.id}
                        sessionId={props.sessionId}
                    />
                </Stack>
                
            </Drawer>
    )
}