import { create } from "zustand";
import { v4 } from "uuid";

import type { ReviewEventRepository } from "@/domain/review/repository/ReviewEventRepository";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { ReviewEvent, ReviewEventLog, NewReviewEvent } from "@/domain/review/ReviewEvent";
import type { SolvedResult } from "@/domain/review/solvedResult"
import type { SessionId } from "@/domain/session/entity/Session";


type ReviewEventStoreState = {
    repo?: ReviewEventRepository
    setRepository: (repo: ReviewEventRepository) => void
    eventLog: ReviewEventLog;
    //getLastReviewedEvent: (m: SessionId) => ReviewEvent | undefined;

    reload: () => Promise<void>;
    save: () => Promise<void>
    append: (reviewEvent: NewReviewEvent) => ReviewEvent
    appendReview: (problemId: ProblemId, reviewId: string, sessionId: SessionId, quality: SolvedResult) => ReviewEvent
    //appendCancel: (targetEventId: ReviewEventId, sessionId: SessionId) => ReviewEvent
    appendReset: (problemId: ProblemId) => ReviewEvent
    clearAll: () => void
};

function createReviewEventId(){ return v4()}

export const useReviewEventStore = create<ReviewEventStoreState>((set, get) => ({
    repo: undefined,
    setRepository: (repo) => set({ repo }),
    eventLog: [],

    reload: async () => {
        try {
            const repo = get().repo
            if (!repo) throw new Error("Repository not initialized")

            const data = await repo.load();
            set({ eventLog: data });
        } catch(e) {
            console.error(e)
        }
    },
    save: async () => {
        const repo = get().repo
        if (!repo) throw new Error("Repository not initialized")
        repo.replaceAll(get().eventLog)
    },
    append: (newevent: NewReviewEvent): ReviewEvent => {
        const event: ReviewEvent = { ...newevent, id: createReviewEventId(), at: Date.now() }        
        set(state => ({
            eventLog: [...state.eventLog, event]
        }))
        get().save()
        return event
    },
    appendReview: (problemId: ProblemId, reviewId: string, sessionId: SessionId, solvedResult: SolvedResult) => {
        const event: NewReviewEvent = {
            type: "reviewed", reviewId, 
            problemId, sessionId: sessionId, solvedResult: solvedResult,
            //actions: actions
        }
        console.log("append review", event)
        
        return get().append(event);
    },
    /*
    appendCancel: (targetEventId: ReviewEventId, sessionId: SessionId, ) => {
        //const target = get().eventLog.find(e => e.id === targetEventId && e.type === "reviewed" && e.sessionId === sessionId)
        const target = get().eventLog.find(e=>e.id===targetEventId)
        console.log("target", target, targetEventId)
        if (!target) throw new Error(`Target not found: ${targetEventId}`)
        const event: NewReviewEvent = {
            type: "cancel", sessionId: sessionId, targetEventId: targetEventId, problemId: target.problemId
        }

        return get().append(event)
    },*/
    appendReset: (problemId: ProblemId) => {
        const event: NewReviewEvent = {
            type: 
            "reset", problemId
        }
        return get().append(event)
    },
    clearAll: () => {
        set({eventLog: []})
        get().save()
    }
}

));
