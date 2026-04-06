import React, { useState } from "react"

import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel"
import type { Problem } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"
import { useReviewEventStore } from "@/ui/domains/learning/hooks/useReviewEventStore"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { ReviewEvent } from "@/domain/review/ReviewEvent"
import type { SolvedResult } from "@/domain/review/solvedResult"
import { useSessionPlayerStatus } from "@/ui/screens/session/hooks/useSessionPlayerStatus"
import { useSessionCompletion } from "@/ui/screens/session/hooks/useSessionCompletion"
import { useSessionPlayerTitleMaker } from "@/ui/screens/session/hooks/useSessionPlayerTitleMaker"
import SessionProblemListDialog from "@/ui/screens/session/SessionProblemListDialog"

////////////////////////////////////////////////
export default function SessionPlayerScreen(){    
    const res = useSessionPlayerStatus()
    
    if (res.status!=="active") return <>not ready</>
    return <SessionPlayerContent problem={res.problem} sessionId={res.sessionId}/>
}
function SessionPlayerContent(props: {
    problem: Problem
    sessionId: SessionId
}){
    const [isListOpen, setIsListOpen] = useState(false)        
    
    const { solve, goNext, skip } = useSessionCompletion(props.problem, props.sessionId)
    const { title } = useSessionPlayerTitleMaker(props.problem)
    const eventLog = useReviewEventStore(s=>s.eventLog)
    const solvedResultMap = getSolvedResultsBySession(eventLog, props.sessionId)
    
    const footerPanel: React.ReactNode = (
        <PlayerFooterPanel
            onNext={goNext}
            onShowList={() => setIsListOpen(true)} />)

    return (
        <>
            <PlayerScreen
                problem={props.problem}
                title={title}
                onSolve={solve}
                onSolvedConfirm={goNext}
                onAfterDelete={skip}
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