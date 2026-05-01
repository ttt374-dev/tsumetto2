import React, { useEffect, useState } from "react"

import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { useSessionPlayerTitleMaker } from "@/ui/screens/session/hooks/useSessionPlayerTitleMaker"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore"
import type { GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"
import type { SessionId } from "@/domain/session/entity/Session"
import { useNavigate, useParams } from "react-router-dom"
import { routes } from "@/ui/App/useAppNavigation"
import { useSessionExecutor } from "@/ui/screens/session/hooks/useSessionExecutor"

const useSessionSideEffect = (sessionId: SessionId, currentIndex: number) => {
    const events = useGameStore(s => s.events)
    const execute = useSessionExecutor(sessionId, currentIndex)

    useEffect(() => {
        const event = events[events.length - 1]
        if (!event) return

        if (event.type === "SOLVE") {
            execute({ type: "SUBMIT_REVIEW"})
        }
    }, [events, execute])
}

////////////////////////////////////////////////
export default function SessionPlayerScreen(){        
    const { sessionId, index } = useParams<{ sessionId: string, index: string }>()    
    const currentIndex = Number(index ?? 0)

    const ids = useSessionStore(s=>s.problemIds)    
    const pid = ids[currentIndex]
    const byId = useProblemStore(s=>s.byId)
    const problem = byId[pid]
    if (!sessionId) return <AppShell>Invalid Sessionid</AppShell>    
        if (!ids.length || currentIndex >= ids.length) {
       return <AppShell>Invalid index</AppShell>
    }

    if (!problem) return <AppShell>Problem Not Available: {pid} {sessionId}:{index} {ids}</AppShell>

    return <SessionPlayerContent 
        problem={problem} sessionId={sessionId} currentIndex={currentIndex}/>
}
function SessionPlayerContent({ problem, sessionId, currentIndex }: {
    problem: Problem
    sessionId: SessionId
    currentIndex: number
}){    
    const { title } = useSessionPlayerTitleMaker(problem, currentIndex)
    const navigate = useNavigate()
    const execute = useSessionExecutor(sessionId, currentIndex)
    
    const footerPanel: React.ReactNode = (
        <PlayerFooterPanel
            onNext={()=> {
                //({type: "FLUSH", problemId: problem.id})   
                //execute({type: "FLUSH"})
                execute({type: "GO_NEXT" })
            }
            }
            //onShowList={() => setIsListOpen(true)} />)
            onShowList={() => navigate(routes.sessionList(sessionId, currentIndex))} />)

    // game eventの処理
    useSessionSideEffect(sessionId, currentIndex)

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
{ /* 
            <SessionProblemListDialog
                open={isListOpen}
                onClose={()=>setIsListOpen(false)}
                selectedProblemId={problem.id}
                sessionId={sessionId}
            />
        */ }
        </>
    )
}
