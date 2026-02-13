import { useEffect, useState } from "react"
import { Problem, type ProblemId } from "@/domain/problem/Problem"
import { useMissionEventStoreContext } from "../../App/providers/MissionEventStoreProvider"
import type { SolvedResult } from "@/domain/learning/Learning"


/////////////////////////////
export function useMissionPlayer() {
    const missionStore = useMissionEventStoreContext()
    const snapshot = missionStore.snapshot

    // --- 主状態は ID ---
    const [currentProblemId, setCurrentProblemId] =
        useState<ProblemId | undefined>(undefined)

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

    // --- 問題削除 / reload 耐性 ---
    useEffect(() => {
        if (!currentProblemId || !snapshot) return

        // ID が mission から消えた or problem が消えた
        if (!ids.includes(currentProblemId)){ //} || !problem) {
            if (index >= 0 && index < ids.length - 1) {
                setCurrentProblemId(ids[index + 1])
            } else if (ids.length > 0) {
                setCurrentProblemId(ids[0])
            } else {
                missionStore.finish()
            }
        }
    }, [ids, currentProblemId])

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
        next()
    }
    return {
        status: "playing" as const,  
        currentProblemId,
        index, snapshot,  // problem, 
        answer, next, prev, moveTo,
    }
}

