import React, { useState } from "react"

import PlayerScreen from "@/ui/player/PlayerScreen"
import { PlayerFooterPanel } from "@/ui/player/components/panels/PlayerFooterPanel"
import { SessionProblemListDialog } from "@/ui/session/SessionProblemListDialog"
import type { Problem } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"
import { useSolvedResultSubmitter } from "@/ui/session/hooks/useSolvedResultSubmitter"
import { useSessionStore } from "@/ui/session/hooks/useSessionStore"
import { useSessionPlayerTitleMaker } from "@/ui/session/hooks/useSessionPlayerTitleMaker"
import { useSessionPlayerStatus } from "@/ui/session/hooks/useSessionPlayerStatus"

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
    
    const { submitSolvedResult, flush } = useSolvedResultSubmitter(props.problem, props.sessionId)
    const { title } = useSessionPlayerTitleMaker(props.problem)
    const nextProblem = useSessionStore(s=>s.next)

    const handleSolve = () => {
        submitSolvedResult()
    }
    const handleNext = async () => {
        flush()
        nextProblem()
    }
    const handleAfterDelete = () => {}
        const footerPanel: React.ReactNode = (
        <PlayerFooterPanel
            onNext={handleNext}
            onShowList={()=>setIsListOpen(true)} />)

    return (
        <>
            <PlayerScreen
                problem={props.problem}
                title={title}
                onSolve={handleSolve}
                onSolvedConfirm={handleNext}
                onAfterDelete={handleAfterDelete}
                footerPanel={footerPanel}
            />

            <SessionProblemListDialog
                open={isListOpen}
                onClose={()=>setIsListOpen(false)}
            />

        </>
    )
}
