import { useMissionStore } from "@/ui/mission/hooks/useMissionStore"
import { useSessionStore } from "@/ui/session/hooks/useSessionStore"
import { useProblemStore } from "@/ui/store/useProblemStore"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import type { SolvedResult } from '@/domain/learning/entity/Learning';
import { useLearningEventStore } from '@/ui/store/useLearningEventStore';
import type { SessionId } from "@/domain/session/entity/Session";

type SessionPlayerVM =
  | { status: "idle" }
  | { status: "finished" }
  | { status: "loading"}
  | { status: "missing"}
  | {
      status: "playing"
      problem: Problem
      title: string      
      index: number
      count: number
      problemIds: ProblemId[]
      sessionId: SessionId | undefined
      results: Record<ProblemId, SolvedResult>
      nextProblem: () => void
      moveToProblemId: (id: ProblemId) => void
      submitAnswer: (res: SolvedResult) => boolean
      undoLastAnswer: () => void
      hasLastAnswer: () => boolean
    }

/////////////////////
export function useSessionPlayerViewModel(): SessionPlayerVM {
    const problemIds = useSessionStore(s => s.problemIds)
    const index = useSessionStore(s => s.currentIndex)
    const missionId = useSessionStore(s => s.missionId)
    const sessionId = useSessionStore(s=>s.sessionId)
    const next = useSessionStore(s => s.next)
    const prev = useSessionStore(s => s.prev)
    const moveToProblemId = useSessionStore(s=>s.moveToId)
    const results = useSessionStore(s=>s.results)
    const submitResult = useSessionStore(s=>s.submitResult)

    const currentProblemId = problemIds[index]
    const count = problemIds.length
    
    const problem = useProblemStore(s => s.byId[currentProblemId])

    // learning event log
    const getLastEvent = useLearningEventStore(s=>s.getLastReviewedEvent)
    const appendReview = useLearningEventStore(s=>s.appendReview)
    const cancel = useLearningEventStore(s=>s.appendCancel)    

    // missionName
    const missionName = useMissionStore(
        s => missionId ? s.missions.find(d => d.id === missionId)?.name ?? "" : ""
    )

    // navigation
    const submitAnswer = (res: SolvedResult) => { // submit したら true を返す        
        if (!sessionId) return　false
        console.log("submit answer", results)
        if (results[currentProblemId]) {
            console.log("alread submitted", currentProblemId, res)
            return false// allready submitted
        }
        submitResult(currentProblemId, res)
        appendReview(currentProblemId, sessionId, res)
        return true
        
    }    

    const undoLastAnswer = () => {
        if (!sessionId) return
        const last = getLastEvent(sessionId)
        if (!last) return       
        
        submitResult(currentProblemId, undefined)
        cancel(last.id, sessionId) 
        console.log("cancel", last.id, results)       
        prev()
    }
    const hasLastAnswer = (): boolean => {
        return sessionId && getLastEvent(sessionId) ? true : false
    }

    if (count === 0) {
        return { status: "idle" }
    }

    if (index < 0 || index >= count) {
        return { status: "finished" }
    }

    if (!currentProblemId) {
        return { status: "finished" }
    }
    
    if (!problem) {
        //if (loading) return { status: "loading" }
        return { status: "loading"} // TODO        
    }

    const title = `[${missionName} (${index + 1}/${count})]: ${problem.title}`       

    return { 
        status: "playing", problemIds, sessionId, results,
        problem, title, index, count, nextProblem: next, moveToProblemId,
        submitAnswer, undoLastAnswer, hasLastAnswer,
     }
}


