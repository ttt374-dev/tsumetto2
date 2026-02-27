import { create } from "zustand";

import type { LearningEventRepository } from "@/domain/learning/repository/LearningEventRepository";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { LearningEventId, LearningEventLog, NewLearningEvent } from "@/domain/learning/entity/LearningEvent";
import type { SolvedResult } from "@/domain/learning/entity/Learning";
import type { MissionId } from "@/domain/mission/entity/Mission";
import { v4 } from "uuid";

type LearningEventStoreState = {
    repo?: LearningEventRepository
    setRepository: (repo: LearningEventRepository) => void
    eventLog: LearningEventLog;
    //repository?: LearningEventRepository;

    reload: () => Promise<void>;
    append: (learningEvent: NewLearningEvent) => void
    recordReview: (problemId: ProblemId, missionId: MissionId, quality: SolvedResult, sec?: number) => void
    recordCancel: (missionId: MissionId, targetEventId: LearningEventId) => void
};

//let repository: LearningEventRepository

function createLearningEventId(){ return v4()}

export const useLearningEventStore = create<LearningEventStoreState>((set, get) => ({
    repo: undefined,
    setRepository: (repo) => set({ repo }),
    eventLog: [],

    reload: async () => {
        try {
            const repo = get().repo
            if (!repo) throw new Error("Repository not initialized")

            const data = await repo.load();
            set({ eventLog: data });
        } catch {
            set({ eventLog: [] });
        }
    },
    append: async (newevent: NewLearningEvent) => {
        const event = { ...newevent, id: createLearningEventId(), at: Date.now() }
        
        set(state => ({
            eventLog: [...state.eventLog, event]
        }))
        
    },
    recordReview: (problemId: ProblemId, missionId: MissionId, quality: SolvedResult, sec?: number) => {
        const event: NewLearningEvent = {
            type: "reviewed", problemId, missionId, quality, sec
        }
        get().append(event);
    },
    recordCancel: (missionId: MissionId, targetEventId: LearningEventId) => {
        const target = get().eventLog.find(e => e.id === targetEventId)

        if (!target) throw new Error("Target not found")
        if (target.missionId !== missionId) {
            throw new Error("Cannot cancel event from different mission")
        }

        const event: NewLearningEvent = {
            type: "cancel", missionId, targetEventId: targetEventId
        }

        get().append(event)
    },}
));
