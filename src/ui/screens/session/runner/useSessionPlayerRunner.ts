import { useParams } from "react-router-dom";

import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useSessionExecutor } from "@/ui/screens/session/runner/useSessionExecutor";
import { useSessionStore } from "@/ui/screens/session/store/useSessionStore";
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore";
import { buildSessionPlayerVieModel } from "@/ui/screens/session/vm/buildSessionPlayerViewModel";
import { parseSessionParams } from "@/ui/screens/session/vm/parseSessionParams";
import type { SessionPlayerInput } from "@/ui/screens/session/vm/SessionPlayerViewModel";
import { interpretPlayerIntent, type PlayerIntent } from "@/application/session/interpretor/interpretPlayerIntent";
import { interpretSessionEvent } from "@/application/session/interpretor/interpretSessionEvent";
import type { SessionEvent } from "@/application/session/SessionEvent";
import type { GameEvent } from "@/domain/game/types/GameEvent";

export function useSessionPlayerRunner() {
    // パラメータを解析
    const params = useParams<{ sessionId: string, index: string }>()
    const resParsed = parseSessionParams(params)
    
    // フックをまず取得
    const sessionId = resParsed.type === "valid" ? resParsed.sessionId : ""
    const index = resParsed.type === "valid" ? resParsed.index : -1
    
    const execute = useSessionExecutor(sessionId, index)    

    // vm
    const ids = useSessionStore(s => s.problemIds)
    const byId = useProblemStore(s => s.byId)
    const missions = useMissionStore(s=>s.missions)
    const missionId = useSessionStore(s=>s.missionId)
    const input: SessionPlayerInput = {
        ...resParsed,
        ids, byId, missions, missionId
    }
    const vm = buildSessionPlayerVieModel(input)

    // intent
    const handlePlayerIntent = (intent: PlayerIntent) => {
        execute(interpretPlayerIntent(intent))
    }
    
    // domain event
    const handleDomainEvent = (e: SessionEvent) => {
        console.log("domain event", e)
        execute(interpretSessionEvent(e))
    }

    const handleGameEvent = (e: GameEvent) => {
        if (e.type === "SOLVE") {
            execute({type: "SUBMIT_REVIEW"})
        }
    }

    const openSessionList = () => {
        execute({ type: "OPEN_SESSION_LIST"})
    }
    const advanceProblem = () => {
        execute( {type: "ADVANCE_PROBLEM"})
    }
    const retreatProblem = () => {
        execute( {type: "RETREAT_PROBLEM"})
    }
    
    // エラーなら返す
    if (vm.type === "error") return vm // { status: "error", message: vm.message}
    
    return {
        ...vm, openSessionList, advanceProblem, retreatProblem,
        handlers: { 
            handlePlayerIntent,    
            handleDomainEvent,    
            handleGameEvent,
        }
    }
}

