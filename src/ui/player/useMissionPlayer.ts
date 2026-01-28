import { useEffect, useState } from "react"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import type { SolvedResult } from "@/domain/MissionEvent/MissionSummary"
import { useLearningEventStore } from "@/application/store/useLearningEventStore"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { useProblemStore } from "@/application/store/useProblemStore"
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider"
import type { MissionSnapshot } from "@/domain/MissionEvent/MissionEvent"

function requireSnapshot(snapshot: MissionSnapshot | null): MissionSnapshot {
    if (!snapshot) {
        throw new Error("Invariant violation: snapshot must exist in playing phase")
    }
    return snapshot
}

/////////////////////////////
export function useMissionPlayer() {
    //const [ index, setIndex] = useState(0)    
    const missionStore = useMissionEventStoreContext()
    const snapshot = requireSnapshot(missionStore.snapshot)

    const repos = useRepositoryContext()
    const problemStore = useProblemStore(repos.problem)
    const learningEventStore = useLearningEventStore(repos.learningEvent)

    // --- 主状態は ID ---
    const [currentProblemId, setCurrentProblemId] =
        useState<ProblemId | null>(null)

    // --- mission 開始時に初期化 ---
    useEffect(() => {
        if (snapshot && snapshot.problemIds.length > 0 && !currentProblemId) {
            setCurrentProblemId(snapshot.problemIds[0])
        }
    }, [snapshot])

    // --- 派生 ---
    const ids = snapshot?.problemIds ?? []
    const index = currentProblemId
        ? ids.indexOf(currentProblemId)
        : -1

    const problem = currentProblemId
        ? problemStore.findById(currentProblemId)
        : undefined

    // --- 問題削除 / reload 耐性 ---
    useEffect(() => {
        if (!currentProblemId || !snapshot) return

        // ID が mission から消えた or problem が消えた
        if (!ids.includes(currentProblemId) || !problem) {
            if (index >= 0 && index < ids.length - 1) {
                setCurrentProblemId(ids[index + 1])
            } else if (ids.length > 0) {
                setCurrentProblemId(ids[0])
            } else {
                missionStore.finish()
            }
        }
    }, [ids, problem])

    // --- navigation ---
    const next = () => {
        if (!snapshot || index < 0) return

        if (index < ids.length - 1) {
            setCurrentProblemId(ids[index + 1])
        } else {
            missionStore.finish()
        }
    }    

    const prev = () => {
        if (!snapshot || index <= 0) return
        setCurrentProblemId(ids[index - 1])
    }
    const moveTo = (id: ProblemId) => {        
        console.log("moveto", id, snapshot, index)
        //if (!snapshot || index <= 0) return 
        
        setCurrentProblemId(id)
    }

    // --- answer handling ---
    const answer = async (
        solvedResult: SolvedResult,
        secToTaken?: number
    ) => {
        if (!snapshot || !currentProblemId) return

        missionStore.answer(currentProblemId, solvedResult, secToTaken)

        await learningEventStore.append({
            type: "reviewed",
            problemId: currentProblemId,
            quality: solvedResult,
            sec: secToTaken,
        })

        next()
    }
    // --- loading 判定 ---
    //if (!snapshot || !currentProblemId) {
    //    return { status: "loading" as const }
    //}


    return {
        status: "playing" as const,  
        index, problem, snapshot,
        answer, next, prev, moveTo,
    }
}

