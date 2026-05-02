import { useEffect, } from "react";
import { useParams } from "react-router-dom";

import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import type { GameUIEvent } from "@/ui/screens/player/hooks/useGameEventHandler";
import { useGameStore, type GameEvent } from "@/ui/screens/player/store/useGameStore";
import { useSessionExecutor } from "@/ui/screens/session/hooks/useSessionExecutor";
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore";
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore";
import { buildSessionPlayerViewModel, type SessionPlayerInput } from "@/ui/screens/session/vm/buildSessionPlayerViewModel";
import { parseSessionParams } from "@/ui/screens/session/vm/parseSessionParams";

/////////////////////////////////////////
export function useSessionPlayerViewModel() {
    // パラメータを解析
    const params = useParams<{ sessionId: string, index: string }>()
    const resParsed = parseSessionParams(params)

    // フックをまず取得
    const sessionId = resParsed.type === "valid" ? resParsed.sessionId : ""
    const index = resParsed.type === "valid" ? resParsed.index : -1
    
    const dispatch = useSessionExecutor(sessionId, index)
    const lastEvent = useGameStore(s => s.events.at(-1))

    // vm
    const ids = useProblemStore(s => s.ids)
    const byId = useProblemStore(s => s.byId)
    const missions = useMissionStore(s=>s.missions)
    const missionId = useSessionStore(s=>s.missionId)
    const input: SessionPlayerInput = {
        ...resParsed,
        ids, byId, missions, missionId
    }
    const vm = buildSessionPlayerViewModel(input)

    // game event 処理
    const onGameEvent = vm.type === "ready" ? vm.onGameEvent : undefined
    useEffect(() => {
        if (!lastEvent || !onGameEvent) return
        const cmd = onGameEvent(lastEvent)
        if (cmd) dispatch(cmd)
    }, [lastEvent, onGameEvent, dispatch])

    // エラーなら返す
    if (vm.type === "error") return vm

    return {
        ...vm,
        goNext: () => dispatch(vm.goNext),
        goList: () => dispatch(vm.goList),
        handleUIEvent: (e: GameUIEvent) => {
            const cmd = vm.handleUIEvent(e)
            cmd && dispatch(cmd)
        }
    }
}

