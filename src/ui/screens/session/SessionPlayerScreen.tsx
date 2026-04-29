import React, { useEffect, useState } from "react"

import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel"
import type { Problem } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { ReviewEvent } from "@/domain/review/ReviewEvent"
import type { SolvedResult } from "@/domain/review/solvedResult"
import { useSessionPlayerStatus } from "@/ui/screens/session/hooks/useSessionPlayerStatus"
import { useSessionCompletion } from "@/ui/screens/session/hooks/useSessionCompletion"
import { useSessionPlayerTitleMaker } from "@/ui/screens/session/hooks/useSessionPlayerTitleMaker"
import SessionProblemListDialog from "@/ui/screens/session/SessionProblemListDialog"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import type { GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler"

////////////////////////////////////////////////
export default function SessionPlayerScreen(){    
    const res = useSessionPlayerStatus()       
    if (res.status!=="active") return <AppShell>not ready</AppShell>    
    return <SessionPlayerContent problem={res.problem} sessionId={res.sessionId}/>
}
function SessionPlayerContent(props: {
    problem: Problem
    sessionId: SessionId
}){
    const [isListOpen, setIsListOpen] = useState(false)        
    
    const { solve, goNext } = useSessionCompletion(props.problem, props.sessionId)
    const { title } = useSessionPlayerTitleMaker(props.problem)
    const eventLog = useReviewEventStore(s=>s.eventLog)
    const solvedResultMap = getSolvedResultsBySession(eventLog, props.sessionId)
    
    const footerPanel: React.ReactNode = (
        <PlayerFooterPanel
            onNext={goNext}
            onShowList={() => setIsListOpen(true)} />)
    // game events
    const events = useGameStore(s => s.events)

    useEffect(() => {
        const last = events.at(-1)
        if (!last) return

        if (last.type === "SOLVE") {
            solve()
        }
    }, [events])

    const handleUIEvent = (uiEvent: GameUIEvent) => {
        switch(uiEvent.type){
            case "solvedConfirmed":
                goNext()
                break;
        }
    }
    // 消された場合
    if (props.problem.deletedAt){
        return <AppShell footer={footerPanel}>Deleted: { props.problem.title}</AppShell>
    }
    return (
        <>
            <PlayerScreen
                problem={props.problem}
                title={title}
                //onSolve={solve}
                //onSolvedConfirm={goNext}
                onUIEvent={handleUIEvent}
                footerPanel={footerPanel}
            />

            <SessionProblemListDialog
                open={isListOpen}
                onClose={()=>setIsListOpen(false)}
                selectedProblemId={props.problem.id}
                solvedResultMap={solvedResultMap}
            />
        </>
    )
}

/////////
// helper
// domain / review
export function getSolvedResultsBySession(
    events: ReviewEvent[],
    sessionId: SessionId
): Record<ProblemId, SolvedResult> {
    const result: Record<ProblemId, SolvedResult> = {}

    for (const e of events) {
        if (e.type !== "reviewed") continue
        if (e.sessionId !== sessionId) continue

        result[e.problemId] = e.solvedResult
    }

    return result
}