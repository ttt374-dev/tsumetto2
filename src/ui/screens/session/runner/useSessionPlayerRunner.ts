import { useParams } from "react-router-dom";

import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useSessionExecutor } from "@/ui/screens/session/runner/useSessionExecutor";
import { useSessionStore } from "@/ui/screens/session/store/useSessionStore";
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore";
import { buildSessionPlayerVieModel } from "@/ui/screens/session/vm/buildSessionPlayerViewModel";
import { parseSessionParams } from "@/ui/screens/session/adaptor/parseSessionParams";
import type { SessionPlayerInput } from "@/ui/screens/session/vm/SessionPlayerViewModel";
import { interpretPlayerIntent, type PlayerIntent } from "@/ui/screens/session/adaptor/buildPlayerIntentAdaptor";

/////////////////////////////////////////
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
    const handlePlayerIntent = (intent: PlayerIntent) => execute(interpretPlayerIntent(intent))
    
    // エラーなら返す
    if (vm.type === "error") return vm

    return {
        ...vm, handlePlayerIntent,    
    }
}

