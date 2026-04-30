import React, { useEffect, useState } from "react"

import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel"
import type { Problem } from "@/domain/problem/entity/Problem"
import { useSessionPlayerTitleMaker } from "@/ui/screens/session/hooks/useSessionPlayerTitleMaker"
import SessionProblemListDialog from "@/ui/screens/session/SessionProblemListDialog"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore"
import type { GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler"
import { useSessionCommandHandler } from "@/ui/screens/session/hooks/useSessionCommandHandler"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"
import type { SessionId } from "@/domain/session/entity/Session"

const useSessionSideEffect = (sessionId: SessionId) => {
    const events = useGameStore(s => s.events)
    const { execute } = useSessionCommandHandler(sessionId)

    useEffect(() => {
        const event = events[events.length - 1]
        if (!event) return

        if (event.type === "SOLVE") {
            execute({ type: "SUBMIT_REVIEW" })
        }
    }, [events])
}

function useSessionProblem(): Problem {
    const byId = useProblemStore(s=>s.byId) 
    const pid = useSessionStore(s=> s.problemIds[s.currentIndex])
    return byId[pid]
}
////////////////////////////////////////////////
export default function SessionPlayerScreen(){        
    const problem = useSessionProblem()
    if (!problem) return <AppShell>Not Available</AppShell>
    return <SessionPlayerContent problem={problem}/>
}
function SessionPlayerContent({ problem }: {
    problem: Problem
}){
    
    const [isListOpen, setIsListOpen] = useState(false)            
    
    const { title } = useSessionPlayerTitleMaker(problem)
    const sessionId = useSessionStore(s=>s.sessionId)
    const { execute } = useSessionCommandHandler(sessionId)
    
    const footerPanel: React.ReactNode = (
        <PlayerFooterPanel
            onNext={()=>execute({type: "GO_NEXT"})}
            onShowList={() => setIsListOpen(true)} />)

    // game eventの処理
    useSessionSideEffect(sessionId)

    // UI event の処理
    const handleUIEvent = (uiEvent: GameUIEvent) => {
        switch(uiEvent.type){
            case "solvedConfirmed":
                execute({type: "GO_NEXT"})
                break;
        }
    }
    
    return (
        <>
            <PlayerScreen
                problem={problem}
                title={title}
                onUIEvent={handleUIEvent}
                footerPanel={footerPanel}
            />

            <SessionProblemListDialog
                open={isListOpen}
                onClose={()=>setIsListOpen(false)}
                selectedProblemId={problem.id}
                sessionId={sessionId}
            />
        </>
    )
}

