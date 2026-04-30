import React, { useEffect, useState } from "react"

import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel"
import type { Problem } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"
import { useSessionPlayerStatus } from "@/ui/screens/session/hooks/useSessionPlayerStatus"
import { useSessionPlayerTitleMaker } from "@/ui/screens/session/hooks/useSessionPlayerTitleMaker"
import SessionProblemListDialog from "@/ui/screens/session/SessionProblemListDialog"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore"
import type { GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler"
import { useSessionCommandHandler } from "@/ui/screens/session/hooks/useSessionCommandHandler"

const useSessionSideEffect = (problem: Problem, sessionId: SessionId) => {
    const events = useGameStore(s => s.events)
    const { execute } = useSessionCommandHandler()

    useEffect(() => {
        const event = events.at(-1)
        if (!event) return

        if (event.type === "SOLVE") {
            execute({ type: "SUBMIT_REVIEW" })
        }
    }, [events])
}

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
    
    const { execute } = useSessionCommandHandler()
    const { title } = useSessionPlayerTitleMaker(props.problem)
    
    const footerPanel: React.ReactNode = (
        <PlayerFooterPanel
            onNext={()=>execute({type: "GO_NEXT"})}
            onShowList={() => setIsListOpen(true)} />)

    // game eventの処理
    useSessionSideEffect(props.problem, props.sessionId)

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

