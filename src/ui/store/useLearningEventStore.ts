import { create } from "zustand";

import type { LearningEventRepository } from "@/domain/learning/repository/LearningEventRepository";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { LearningEvent, LearningEventId, LearningEventLog, NewLearningEvent } from "@/domain/learning/entity/LearningEvent";
import type { SolvedResult } from "@/domain/learning/entity/Learning";
import type { SessionId } from "@/domain/session/entity/Session";
import { v4 } from "uuid";

type LearningEventStoreState = {
    repo?: LearningEventRepository
    setRepository: (repo: LearningEventRepository) => void
    eventLog: LearningEventLog;
    getLastReviewedEvent: (m: SessionId) => LearningEvent | undefined;

    reload: () => Promise<void>;
    append: (learningEvent: NewLearningEvent) => LearningEvent
    appendReview: (problemId: ProblemId, sessionId: SessionId, quality: SolvedResult, sec?: number) => LearningEvent
    appendCancel: (targetEventId: LearningEventId, sessionId: SessionId) => LearningEvent
    appendReset: (problemId: ProblemId) => LearningEvent
    clearAll: () => void
};

function createLearningEventId(){ return v4()}

export const useLearningEventStore = create<LearningEventStoreState>((set, get) => ({
    repo: undefined,
    setRepository: (repo) => set({ repo }),
    eventLog: [],
    getLastReviewedEvent: (sessionId: SessionId) => {
        const canceled = new Set<string>()

        for (let i = get().eventLog.length - 1; i >= 0; i--) {
            const e = get().eventLog[i]

            if (e.type === "cancel") {
                canceled.add(e.targetEventId)
            }

            if (e.type === "reviewed" && e.sessionId === sessionId) {
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
    append: (newevent: NewLearningEvent): LearningEvent => {
        const event: LearningEvent = { ...newevent, id: createLearningEventId(), at: Date.now() }        
        set(state => ({
            eventLog: [...state.eventLog, event]
        }))
        console.log("append event", event)
        return event
    },
    appendReview: (problemId: ProblemId, sessionId: SessionId, solvedResult: SolvedResult) => {
        const event: NewLearningEvent = {
            type: "reviewed", problemId, sessionId: sessionId, solvedResult: solvedResult
        }
        
        return get().append(event);
    },
    appendCancel: (targetEventId: LearningEventId, sessionId: SessionId, ) => {
        //const target = get().eventLog.find(e => e.id === targetEventId && e.type === "reviewed" && e.sessionId === sessionId)
        const target = get().eventLog.find(e=>e.id===targetEventId)
        console.log("target", target, targetEventId)
        if (!target) throw new Error(`Target not found: ${targetEventId}`)
        const event: NewLearningEvent = {
            type: "cancel", sessionId: sessionId, targetEventId: targetEventId, problemId: target.problemId
        }

        return get().append(event)
    },
    appendReset: (problemId: ProblemId) => {
        const event: NewLearningEvent = {
            type: 
            "reset", problemId
        }
        return get().append(event)
    },
    clearAll: () => {
        set({eventLog: []})
    }
}

));
