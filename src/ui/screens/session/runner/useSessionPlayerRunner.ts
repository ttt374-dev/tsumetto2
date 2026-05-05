import { useParams } from "react-router-dom";

import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useSessionExecutor } from "@/ui/screens/session/runner/useSessionExecutor";
import { useSessionStore } from "@/ui/screens/session/store/useSessionStore";
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore";
import { buildSessionPlayerVieModel } from "@/ui/screens/session/vm/buildSessionPlayerViewModel";
import { parseSessionParams } from "@/ui/screens/session/adaptor/parseSessionParams";
import type { SessionPlayerInput, SessionPlayerViewModel } from "@/ui/screens/session/vm/SessionPlayerViewModel";
import { interpretPlayerIntent, type PlayerIntent } from "@/ui/screens/session/adaptor/interpretPlayerIntent";
import type { DomainEvent } from "@/ui/screens/player/runner/runGameEffects";
import type { SessionCommand } from "@/ui/screens/session/vm/resolveSessionCommand";
import { interpretDomainEvent } from "@/ui/screens/session/adaptor/interpretDomainEvent";
import { useCallback, useEffect, useRef } from "react";

/////////////////////////////////////////
/*
type SessionPlayerRunnerModel = 
    | { status: "ok", state: SessionPlayerViewModel, 
        handlers: {
            handlePlayerIntent: (intent: PlayerIntent) => void
        }}
    | { status: "error", message?: string}
*/
export function useSessionPlayerRunner() {
    // パラメータを解析
    const params = useParams<{ sessionId: string, index: string }>()
    const resParsed = parseSessionParams(params)
    
    // フックをまず取得
    const sessionId = resParsed.type === "valid" ? resParsed.sessionId : ""
    const index = resParsed.type === "valid" ? resParsed.index : -1
    
    const execute = useSessionExecutor(sessionId, index)    

    //const executeRef = useRef(execute)

    //useEffect(() => {
    //    executeRef.current = execute
    //}, [execute])

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
    const handlePlayerIntent = (intent: PlayerIntent) => 
        execute(interpretPlayerIntent(intent))
    
    // domain event
    const handleDomainEvent = (e: DomainEvent) => {
        console.log("domain event", e)
        execute(interpretDomainEvent(e))
    }
    
    // エラーなら返す
    if (vm.type === "error") return vm // { status: "error", message: vm.message}
    
    return {
        ...vm,
        handlers: { 
            handlePlayerIntent,    
            handleDomainEvent,    
        }
    }
}

