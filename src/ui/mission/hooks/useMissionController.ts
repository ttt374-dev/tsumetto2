import { useEffect, useMemo, useState } from "react";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import type { MissionResultEntry, SolvedResult } from "@/domain/MissionEvent/MissionSummary";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import type { LearningEvent } from "@/domain/LearningEvent/";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";
import { useMissionEventStore } from "@/application/store/useMissionEventStore";
import type { MissionFinished, MissionProblemAnswered, MissionSnapshot, MissionStarted } from "@/domain/MissionEvent/MissionEvent";

//export type MissionPhase = "idle" | "playing" | "summary"

const snapshotToResultList = (snapshot: MissionSnapshot) => {
    return Object.values(snapshot.answered).map(e => ({
        problemId: e.problemId,
        solvedResult: e.result,
    }))
}

//////////////////////////////
export function useMissionController() {
    //const [phase, setPhase] = useState<MissionPhase>("idle")    
    const [index, setIndex] = useState(0)    

    const repos = useRepositoryContext()
    const learningEventStore = useLearningEventStore(repos.learningEvent)
    const missionEventStore = useMissionEventStore()
    const snapshot = missionEventStore.snapshot
    //const phase = snapshot?.phase ?? "idle"
    
    
    ///////////////////////////////////////////
    // idle
    const start = (ids: ProblemId[]) => {
        if (ids.length === 0) return null
        missionEventStore.start(ids)        
    }

    ///////////////////////////
    // playing
    const currentProblemId = snapshot && snapshot.problemIds[index]
    // --- navigation ---
    function next() {
        if (snapshot) {
            if (index < snapshot.problemIds.length - 1) {
                setIndex(i => i + 1)
            } else {
                missionEventStore.finish()
            }
        }
    }
    function prev() {
        setIndex(i => Math.max(i - 1, 0))
    }

    // --- answer handling ---
    const answer = async (
        problemId: ProblemId,
        solvedResult: SolvedResult,
        secToTaken?: number
    ) => {

        if (!snapshot) return
        missionEventStore.answer(problemId, solvedResult, secToTaken)

        // Learning への反映は「副作用」としてここで
        const learningEvent: Omit<LearningEvent, "at"> = {
            type: "reviewed",
            problemId: problemId,
            quality: solvedResult,
            sec: secToTaken,
        }
        await learningEventStore.append(learningEvent)
        next()

    }
    ///////////////
    // finished
    const missionResultList: MissionResultEntry[] =
        snapshot ? snapshotToResultList(snapshot) : []
        
    const reset = () => {
        missionEventStore.reset()
        setIndex(0)
    }
/*
    return {
        idle: phase === "idle" ? { start } : null,
        playing: phase === "playing" ? {
            currentProblemId,
            next,
            prev,
            answer
        } : null,
        finished: phase === "finished" ? {
            missionResultList,
            reset
        } : null
    }
        */
    return {
        // state
        phase: snapshot?.phase ?? "idle",
        index,        
        currentProblemId,
        snapshot: snapshot as Readonly<MissionSnapshot>,
        missionResultList,

        reset,
        answer,
        start, next, prev,
    }
}

