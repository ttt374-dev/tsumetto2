import { create } from "zustand";
import type { LearningEvent, LearningEventLog, LearningReviewedEvent } from "@/domain/LearningEvent";
import type { LearningEventRepository } from "@/domain/LearningEvent/LearningEventRepository";
import type { ProblemId } from "@/domain/problem/Problem";
import type { SolvedResult } from "@/domain/learning/Learning";

type LearningEventStoreState = {
    eventLog: LearningEventLog;
    repository?: LearningEventRepository;

    // repository 注入用
    //initLearningEventRepository: (repo: LearningEventRepository) => void;

    reload: () => Promise<void>;
    append: (learningEvent: LearningEvent) => Promise<void>;
    review: (problemId: ProblemId, quality: SolvedResult, sec?: number) => Promise<void>;
    //deleteAll: () => Promise<void>;
    //deleteByProblemIds: (ids: ProblemId[]) => Promise<void>;
};

let repository: LearningEventRepository

export const initLearningEventRepository = (repo: LearningEventRepository) => {
    repository = repo
}

export const useLearningEventStore = create<LearningEventStoreState>((set, get) => {
    const appendQueue: LearningEvent[] = [];

    const processQueue = async (repository: LearningEventRepository) => {
        while (appendQueue.length > 0) {
            const e = appendQueue[0];
            set(state => ({ eventLog: [...state.eventLog, e] }));
            await repository.append(e);
            appendQueue.shift();
        }
    };

    return {
        eventLog: [],

        reload: async () => {
            try {
                const data = await repository.load();
                set({ eventLog: data });
            } catch {
                set({ eventLog: [] });
            }
        },

        append: async (event: LearningEvent) => {            
            appendQueue.push(event);
            if (appendQueue.length > 1) return;
            await processQueue(repository);
        },

        review: async (problemId: ProblemId, quality: SolvedResult, sec?: number) => {
            const reviewEvent: LearningReviewedEvent = { 
                type: "reviewed", problemId, quality, sec, at: Date.now() }
            await get().append(reviewEvent);
        },

        /*
        deleteAll: async () => {
            await repository.removeAll();
            await get().reload();
        },

        deleteByProblemIds: async (ids) => {
            const idSet = new Set(ids);
            set(state => ({ eventLog: state.eventLog.filter(e => !idSet.has(e.problemId)) }));
            await repository.replaceAll(get().eventLog);
        },
        */
    };
});
