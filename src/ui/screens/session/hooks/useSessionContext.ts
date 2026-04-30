import { useGameStore } from "@/ui/screens/player/store/useGameStore"
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore"

export function useSessionContext() {
    const session = useSessionStore()

    const problemId = session.problemIds[session.currentIndex]

    //const gameState = useGameStore(s => s.state)

    return {
        sessionId: session.sessionId,
        problemId,
        index: session.currentIndex,
        phase: session.phase(),
        //gameState,
        isLast: session.currentIndex === session.problemIds.length - 1
    }
}