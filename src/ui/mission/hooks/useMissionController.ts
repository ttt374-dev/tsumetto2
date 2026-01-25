import { useEffect, useMemo, useState } from "react";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import type { MissionResultEntry, SolvedResult } from "@/domain/MissionEvent/MissionSummary";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import type { LearningEvent } from "@/domain/LearningEvent/";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";
import { useMissionEventStore } from "@/application/store/useMissionEventStore";
import type { MissionFinished, MissionProblemAnswered, MissionSnapshot, MissionStarted } from "@/domain/MissionEvent/MissionEvent";

export type MissionPhase = "idle" | "playing" | "summary"

//////////////////////////////
export function useMissionController() {
    //const [phase, setPhase] = useState<MissionPhase>("idle")    
    const [index, setIndex] = useState(0)    

    const repos = useRepositoryContext()
    const learningEventStore = useLearningEventStore(repos.learningEvent)
    const missionEventStore = useMissionEventStore()
    const snapshot = missionEventStore.snapshot
    const phase = snapshot?.phase ?? "idle"

    const currentProblemId = snapshot && snapshot.problemIds[index]

    const missionResultList: MissionResultEntry[] =
        snapshot
            ? Object.values(snapshot.answered).map(e => ({
                problemId: e.problemId,
                solvedResult: e.result,
            }))
            : []

    // --- phase control ---
    const start = (ids: ProblemId[]) => {
        if (ids.length === 0) return null
        const ev: Omit<MissionStarted, "at"> = {
            type: "MissionStarted",
            missionId: crypto.randomUUID(),
            problemIds: ids
        }
        missionEventStore.append(ev)
        //setPhase("playing")
    }
    const resetPhase = () => {
        missionEventStore.reset()
        setIndex(0)
        //setPhase("idle")
    }

    // --- navigation ---
    function next() {
        if (snapshot) {
            if (index < snapshot.problemIds.length - 1) {
                setIndex(i => i + 1)
            } else {
                missionEventStore.append({
                    type: "MissionFinished",
                    missionId: snapshot.missionId
                })
                //setPhase("summary")
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
        const missionEvent: Omit<MissionProblemAnswered, "at"> = {
            type: "MissionProblemAnswered",
            missionId: snapshot.missionId,
            problemId: problemId as ProblemId,
            result: solvedResult,
            sec: secToTaken,
        }
        missionEventStore.append(missionEvent)

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

    /*
    const finish = (missionId: string) => {
        if (phase !== "playing") return

        missionEventStore.append({
            type: "MissionFinished",
            missionId: missionId
        })
    }*/
    
    return {
        // state
        phase,
        index,        
        currentProblemId,
        snapshot: snapshot as ReadonlyMissionSnapshot,
        missionResultList,

        resetPhase,
        answer,// finish,
        start, next, prev,
    }
}

export type ReadonlyMissionSnapshot =
    Readonly<MissionSnapshot>
