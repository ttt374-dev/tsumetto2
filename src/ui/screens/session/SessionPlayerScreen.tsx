import React, { useEffect, useState } from "react"

import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { useSessionPlayerTitleMaker } from "@/ui/screens/session/hooks/useSessionPlayerTitleMaker"
import SessionProblemListDialog from "@/ui/screens/session/SessionProblemListDialog"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore"
import type { GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler"
import { useSessionCommandHandler } from "@/ui/screens/session/hooks/useSessionCommandHandler"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"
import type { SessionId } from "@/domain/session/entity/Session"
import { useNavigate, useParams } from "react-router-dom"

const useSessionSideEffect = (sessionId: SessionId, problemId: ProblemId) => {
    const events = useGameStore(s => s.events)
    const { execute } = useSessionCommandHandler(sessionId)

    useEffect(() => {
        const event = events[events.length - 1]
        if (!event) return

        if (event.type === "SOLVE") {
            execute({ type: "SUBMIT_REVIEW", problemId })
        }
    }, [events, sessionId, problemId])
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
    const [isListOpen, setIsListOpen] = useState(false)            
    
    const { title } = useSessionPlayerTitleMaker(problem, currentIndex)
    const { execute } = useSessionCommandHandler(sessionId)
    
    const footerPanel: React.ReactNode = (
        <PlayerFooterPanel
            onNext={()=> {
                execute({type: "FLUSH", problemId: problem.id})   
                execute({type: "GO_NEXT", currentIndex })
            }
            }
            onShowList={() => setIsListOpen(true)} />)

    // game eventの処理
    useSessionSideEffect(sessionId, problem.id)

    // UI event の処理
    const handleUIEvent = (uiEvent: GameUIEvent) => {
        switch(uiEvent.type){
            case "solvedConfirmed":
                execute({type: "GO_NEXT", currentIndex: currentIndex})
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

