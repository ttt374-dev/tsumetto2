import { create } from "zustand";

import type { LearningEventRepository } from "@/domain/learning/repository/LearningEventRepository";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { LearningEvent, LearningEventId, LearningEventLog, NewLearningEvent } from "@/domain/learning/entity/LearningEvent";
import type { SolvedResult } from "@/domain/learning/entity/Learning";
import type { MissionId } from "@/domain/mission/entity/Mission";
import { v4 } from "uuid";

type LearningEventStoreState = {
    repo?: LearningEventRepository
    setRepository: (repo: LearningEventRepository) => void
    eventLog: LearningEventLog;
    getLastReviewedEvent: (m: MissionId) => LearningEvent | undefined;

    reload: () => Promise<void>;
    append: (learningEvent: NewLearningEvent) => void
    appendReview: (problemId: ProblemId, missionId: MissionId, quality: SolvedResult, sec?: number) => void
    appendCancel: (missionId: MissionId, targetEventId: LearningEventId) => void
    appendReset: (problemId: ProblemId) => void
    clearAll: () => void
};

function createLearningEventId(){ return v4()}

export const useLearningEventStore = create<LearningEventStoreState>((set, get) => ({
    repo: undefined,
    setRepository: (repo) => set({ repo }),
    eventLog: [],
    getLastReviewedEvent: (missionId: MissionId) => {
        const canceled = new Set<string>()

        for (let i = get().eventLog.length - 1; i >= 0; i--) {
            const e = get().eventLog[i]

            if (e.type === "cancel") {
                canceled.add(e.targetEventId)
            }

            if (e.type === "reviewed" && e.missionId === missionId) {
                if (!canceled.has(e.id)) {
                    return e
                }
            }
        }

        return undefined  
    },

    reload: async () => {
        try {
            const repo = get().repo
            if (!repo) throw new Error("Repository not initialized")

            const data = await repo.load();
            set({ eventLog: data });
        } catch(e) {
            //set({ eventLog: [] });
            console.error(e)
        }
    },
    append: (newevent: NewLearningEvent) => {
        const event: LearningEvent = { ...newevent, id: createLearningEventId(), at: Date.now() }        
        set(state => ({
            eventLog: [...state.eventLog, event]
        }))
        
    },
    appendReview: (problemId: ProblemId, missionId: MissionId, quality: SolvedResult, sec?: number) => {
        const event: NewLearningEvent = {
            type: "reviewed", problemId, missionId, quality, sec
        }
        get().append(event);
    },
    appendCancel: (missionId: MissionId, targetEventId: LearningEventId) => {
        const target = get().eventLog.find(e => e.id === targetEventId && e.type === "reviewed" && e.missionId === missionId)

        if (!target) throw new Error("Target not found")

        const event: NewLearningEvent = {
            type: "cancel", targetEventId: targetEventId
        }

        get().append(event)
    },
    appendReset: (problemId: ProblemId) => {
        const event: NewLearningEvent = {
            type: 
            "reset", problemId
        }
        get().append(event)
    },
    clearAll: () => {
        set({eventLog: []})
    }
}

));
