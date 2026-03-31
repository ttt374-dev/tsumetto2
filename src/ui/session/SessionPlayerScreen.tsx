import React, { useState } from "react"

import PlayerScreen from "@/ui/player/PlayerScreen"
import { PlayerFooterPanel } from "@/ui/player/components/panels/PlayerFooterPanel"
import { SessionProblemListDialog } from "@/ui/session/SessionProblemListDialog"
import type { Problem } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"
import { useSessionCompletion } from "@/ui/session/hooks/useSessionCompletion"
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
    
    const { solve, goNext, skip } = useSessionCompletion(props.problem, props.sessionId)
    const { title } = useSessionPlayerTitleMaker(props.problem)
    
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
            />

        </>
    )
}
