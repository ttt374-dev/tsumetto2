import { useMissionStore } from "@/ui/store/useMissionStore"
import { useSessionStore } from "@/ui/store/useSessionStore"
import { useProblemStore } from "@/ui/store/useProblemStore"
import type { Problem } from "@/domain/problem/entity/Problem"
import type { SolvedResult } from '@/domain/learning/entity/Learning';
import { useLearningEventStore } from '@/ui/store/useLearningEventStore';

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
      nextProblem: () => void
      submitAnswer: (res: SolvedResult) => void
      undoLastAnswer: () => void
    }

/////////////////////
export function useSessionPlayerViewModel(): SessionPlayerVM {
    const problemIds = useSessionStore(s => s.problemIds)
    //const learningEvents = useLearningEventStore(s=>s.eventLog)

    const index = useSessionStore(s => s.currentIndex)
    const missionId = useSessionStore(s => s.missionId)

    const sessionId = useSessionStore(s=>s.sessionId)
    const next = useSessionStore(s => s.next)
    const prev = useSessionStore(s => s.prev)
    //const moveTo = useSessionStore(s => s.moveToId)

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
    //const problemNavigation = useMemo(() => ({ next, prev, moveTo }), [next, prev, moveTo])

    const submitAnswer = (res: SolvedResult) => {
        //console.log("submit answer", problemId, sessionId)
        if (!sessionId) return
        appendReview(currentProblemId, sessionId, res)
        //next()
        
    }    

    const undoLastAnswer = () => {
        if (!sessionId) return
        const last = getLastEvent(sessionId)
        if (!last) return       
        
        cancel(sessionId, last.id)        
        //console.log("undo last", last)
        prev()
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
        status: "playing", 
        problem, title, index, count, nextProblem: next,
        submitAnswer, undoLastAnswer,
     }
}


