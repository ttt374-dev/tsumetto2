import { useEffect, useState } from "react"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import type { SolvedResult } from "@/domain/MissionEvent/MissionSummary"
import { useLearningEventStore } from "@/application/store/useLearningEventStore"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { useProblemStore } from "@/application/store/useProblemStore"
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider"
import type { LearningEvent } from "@/domain/LearningEvent"
import type { MissionSnapshot } from "@/domain/MissionEvent/MissionEvent"

function requireSnapshot(snapshot: MissionSnapshot | null): MissionSnapshot {
  if (!snapshot) {
    throw new Error("Invariant violation: snapshot must exist in playing phase")
  }
  return snapshot
}

/////////////////////////////


export function useMissionPlayer(){
    const [ index, setIndex] = useState(0)    
    const missionStore = useMissionEventStoreContext()
    const snapshot = requireSnapshot(missionStore.snapshot)
    const currentProblemId = snapshot.problemIds[index]
      if (!currentProblemId) {
          throw new Error("Invariant violation: invalid problem index")
      }
    const repos = useRepositoryContext()  
    const problemStore = useProblemStore(repos.problem)
    const problem = problemStore.findById(currentProblemId)
    const learningEventStore = useLearningEventStore(repos.learningEvent)

    // --- navigation ---
    const next = () => {
            if (index < snapshot.problemIds.length - 1) {
                setIndex(i => i + 1)
            } else {
                missionStore.finish()
            }
    }
    const prev = () => {
        setIndex(i => Math.max(i - 1, 0))
    }
    // --- answer handling ---
    const answer = async (
        //problemId: ProblemId,
        solvedResult: SolvedResult,
        secToTaken?: number
    ) => {
        missionStore.answer(currentProblemId, solvedResult, secToTaken)

        // Learning への反映は「副作用」としてここで
        const learningEvent: Omit<LearningEvent, "at"> = {
            type: "reviewed",
            problemId: currentProblemId,
            quality: solvedResult,
            sec: secToTaken,
        }
        await learningEventStore.append(learningEvent)
        next()
    }

    return {
        //status: "playing", 
        index, problem, snapshot,
        answer, next, prev,         
    }
}

