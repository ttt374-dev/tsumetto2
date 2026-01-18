import { useEffect, useMemo, useState } from "react";
import type { AnswerEntry, AnswerResult } from "@/application/missionFsm/MissionFsm";
import type { Exercise } from "@/domain/Exercise/Exercise";
import type { Problem } from "@/domain/problem/Problem";

export type MissionPhase = "idle" | "playing" | "summary"

export function useMissionController(exercises: Exercise[],
    onAnswer: (
        exercise: Exercise,
        result: AnswerResult,
        sec?: number
    ) => void

) {
    const [phase, setPhase] = useState<MissionPhase>("idle")
    const [index, setIndex] = useState(0)
    const [answerEntries, setAnswerEntries] = useState<AnswerEntry[]>([])

    const currentExercise = useMemo(()=> { 
        return exercises[index]}, [exercises, index])

    // --- phase control ---
    const start = () => {
        if (exercises.length === 0) return
        setPhase("playing")
        setIndex(0)
        setAnswerEntries([])
    }

    // --- navigation ---
    const next = () => {
        setIndex(i => {
            if (i >= exercises.length - 1) {
                setPhase("summary")
                return i
            }
            return i + 1
        })
    }

    const prev = () => {
        setIndex(i => Math.max(0, i - 1))
    }

    // --- answer handling ---
    const answer = (
        problem: Problem,
        answerResult: AnswerResult,
        secToTaken?: number
    ) => {
        const entry: AnswerEntry = {
            problemId: problem.id,
            answerResult,
            //secToTaken,
        }

        setAnswerEntries(prev => [...prev, entry])
        next()
    }

    // --- safety ---
    useEffect(() => {
        if (phase === "playing" && !currentExercise) {
            setPhase("summary")
        }
    }, [phase, currentExercise])

    return {
        // state
        phase,
        index,
        currentExercise,
        answerEntries,
        answer,
        start, next, prev,
    }
}

