import { useNavigate, useParams } from "react-router-dom"

import { paths } from "@/router/paths"
import { createSessionId } from "@/ui/screens/session/store/useSessionStore"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import PlayerScreen from "./PlayerScreen"
import { Button, Stack } from "@mui/material"
import type { PlayerIntent } from "@/application/session/interpretor/interpretPlayerIntent"
import { useSessionExecutor } from "../session/runner/useSessionExecutor"
import { createSessionBridge } from "../session/runner/createSessionBridge"
import { useCallback, useMemo, useRef } from "react"
import type { Problem } from "@/domain/problem/entity/Problem"
import { AppShell } from "@/ui/common/components/layout/AppShell"

export default function SinglePlayerScreen() {        
    const resRoute = useRouteProblem()
    if (resRoute.status === "error") return <AppShell>Error: {resRoute.error}</AppShell>
    const { problem } = resRoute
    const sessionId = useRef(createSessionId()).current    
    const execute = useSessionExecutor(sessionId, 0)
    const bridge = useMemo(
        () => createSessionBridge(execute),
        [execute]
    )

    const navigateBack = useNavigateBack()

    const handlePlayerIntent = (intent: PlayerIntent) => {
        switch(intent.type){
            case "PROBLEM_CONFIRMED":
                navigateBack()
                break;
        }
    }
    return (
        <PlayerScreen problem={problem}
            footer={(<Footer onBack={navigateBack} />)} 
            onGameEvent={bridge.game.handleEvent}
            onPlayerIntent={handlePlayerIntent}
        />
    )
}
function Footer (props: {onBack: () => void}){
    const { onBack } = props
    return <Stack>
        <Button fullWidth variant="outlined" onClick={onBack}>
            戻る
        </Button>
    </Stack>
}

type RouteProblemResult =
    | { status: "ok"; problem: Problem }
    | { status: "error"; error: RouteProblemError }

type RouteProblemError =
    | "missing-id"
    | "not-found"

function useRouteProblem(): RouteProblemResult {
    const { id: problemId } = useParams<{ id: string }>()

    const byId = useProblemStore(s => s.byId)

    if (!problemId) {
        return {status: "error", error: "missing-id"}
    }   
    const problem = byId[problemId]
    if (!problem) {
        return { status: "error", error: "not-found" }
    }
    return { status: "ok",problem }
}
function useNavigateBack() {
    const navigate = useNavigate()

    return useCallback(() => {
        navigate(paths.back)
    }, [navigate])
}