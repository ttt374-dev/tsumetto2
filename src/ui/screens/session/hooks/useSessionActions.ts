import type { SessionExecutor } from "@/ui/screens/session/runner/createSessionBridge"


export function useSessionActions(execute: SessionExecutor) {
    const openSessionList = () => {
        execute({ type: "OPEN_SESSION_LIST" })
    }
    const advanceProblem = () => {
        execute({ type: "ADVANCE_PROBLEM" })
    }
    const retreatProblem = () => {
        execute({ type: "RETREAT_PROBLEM" })
    }

    return { 
        navigation: {
            openSessionList, advanceProblem, retreatProblem
        }
    }
}