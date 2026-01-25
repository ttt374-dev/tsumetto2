import { useEffect, useMemo, useState } from "react";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import type { MissionResultEntry, SolvedResult } from "@/domain/MissionEvent/MissionSummary";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import type { LearningEvent } from "@/domain/LearningEvent/";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";
import { useMissionEventStore } from "@/application/store/useMissionEventStore";
import type { MissionFinished, MissionProblemAnswered, MissionSnapshot, MissionStarted } from "@/domain/MissionEvent/MissionEvent";
import { useMissionController } from "./useMissionController";



//////////////////////////////
export function useMissionRoot() {
    const controller = useMissionController()

    return {
        idle: controller.phase === "idle" ? { start: controller.start } : null,
        playing: controller.phase === "playing" ? {
            currentProblemId: controller.currentProblemId,
            next: controller.next,
            prev: controller.prev,
            answer: controller.answer
        } : null,
        finished: controller.phase === "finished" ? {
            missionResultList: controller.missionResultList,
            reset: controller.reset
        } : null
    }
}


export function useMissionIdle(){
    const controller = useMissionController()
    return {
        start: controller.start
    }
}
export function useMissionPlaying(){
    const controller = useMissionController()
    return {
        currentProblemId: controller.currentProblemId,
        next: controller.next,
        prev: controller.prev,
        answer: controller.answer
    }
}
export function useMissionFinished(){
    const controller = useMissionController()
    return {
        missionResultList: controller.missionResultList,
        reset: controller.reset
    }
}