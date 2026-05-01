import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"
import type { SessionId } from "@/domain/session/entity/Session"
import { useNavigate, useParams } from "react-router-dom"
import { useSessionPlayerViewModel } from "@/ui/screens/session/hooks/useSessionPlayerViewModel"

type SessionPlayerValidationResult = 
    | { type: "error", message: string}
    | { type: "ready", problem: Problem, sessionId: SessionId, currentIndex: number}

function useSessionPlayerValidation(): SessionPlayerValidationResult{
    const { sessionId, index } = useParams<{ sessionId: string, index: string }>()
    // sessionId
    if (!sessionId) {
        return { type: "error", message: "Invalid sessionId" } as const
    }
    // index
    const currentIndex = Number(index)
    if (index === null){
        return { type: "error", message: "index is required"}
    }
    if (Number.isNaN(currentIndex) || currentIndex < 0){
        return { type: "error", message: "invalid currentIndex"}
    }
    // ids
    const ids = useSessionStore(s => s.problemIds)
    if (!ids.length || currentIndex >= ids.length) {
        return { type: "error", message: "Invalid index" } as const
    }
    // problem
    const pid = ids[currentIndex]    
    const problem = useProblemStore(s => pid !== undefined ? s.byId[pid] : undefined)

    if (!problem) {
        return { type: "error", message: `Problem not found: ${pid}` } as const
    }
    return { type: "ready", problem, sessionId, currentIndex}
}
export default function SessionPlayerScreen() {
    const res = useSessionPlayerValidation()
    if (res.type === "error") return <AppShell>{ res.message}</AppShell>
    
    return <SessionPlayerContent
        problem={res.problem} sessionId={res.sessionId} currentIndex={res.currentIndex} />
}
function SessionPlayerContent({ problem, sessionId, currentIndex }: {
    problem: Problem
    sessionId: SessionId
    currentIndex: number
}) {
    const vm = useSessionPlayerViewModel(problem, sessionId, currentIndex)
    return (
        <PlayerScreen
            problem={problem}
            title={vm.title}
            onUIEvent={vm.handleUIEvent}
            footerPanel={
                <PlayerFooterPanel
                    onNext={vm.goNext}
                    onShowList={vm.goList} />
            }
        />

    )
}
