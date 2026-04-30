import React, { useEffect, useState } from "react"

import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel"
import type { Problem } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"
import { useSessionPlayerStatus } from "@/ui/screens/session/hooks/useSessionPlayerStatus"
import { useSessionPlayerTitleMaker } from "@/ui/screens/session/hooks/useSessionPlayerTitleMaker"
import SessionProblemListDialog from "@/ui/screens/session/SessionProblemListDialog"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import type { GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler"
import { useSessionCommandHandler } from "@/ui/screens/session/hooks/useSessionCommandHandler"

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
    
    const { execute } = useSessionCommandHandler(props.problem, props.sessionId)
    const { title } = useSessionPlayerTitleMaker(props.problem)
    
    const footerPanel: React.ReactNode = (
        <PlayerFooterPanel
            onNext={()=>execute({type: "GO_NEXT"})}
            onShowList={() => setIsListOpen(true)} />)

    // game eventの処理
    const events = useGameStore(s => s.events)
    const lastEvent = events.at(-1)
    useEffect(() => {
        if (!lastEvent) return
        if (lastEvent.type === "SOLVE") {
            execute({type: "SUBMIT_REVIEW"})
        }
    }, [lastEvent])

    // UI event の処理
    const handleUIEvent = (uiEvent: GameUIEvent) => {
        switch(uiEvent.type){
            case "solvedConfirmed":
                execute({type: "GO_NEXT"})
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
                onUIEvent={handleUIEvent}
                footerPanel={footerPanel}
            />

            <SessionProblemListDialog
                open={isListOpen}
                onClose={()=>setIsListOpen(false)}
                selectedProblemId={props.problem.id}
                sessionId={props.sessionId}
            />
        </>
    )
}

