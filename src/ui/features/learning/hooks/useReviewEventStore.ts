import { create } from "zustand";
import { v4 } from "uuid";

import type { ReviewEventRepository } from "@/domain/review/repository/ReviewEventRepository";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { ReviewEvent, ReviewEventLog, NewReviewEvent, ReviewEventId } from "@/domain/review/types/ReviewEvent";
import type { SolvedResult } from "@/domain/review/types/solvedResult"
import type { SessionId } from "@/domain/session/entity/Session";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";

type ReviewEventStoreState = {
    repo?: ReviewEventRepository
    setRepository: (repo: ReviewEventRepository) => void
    eventLog: ReviewEventLog;
    //isDirty: boolean,
    //getLastReviewe1vent: (m: SessionId) => ReviewEvent | undefined;

    replaceAll: (events: ReviewEventLog) => void
    appendLocal: (event: ReviewEvent) => void
    removeLocal: (eventId: ReviewEventId) => void
    rollback: (prev: ReviewEventLog) => void
    
    reload: () => Promise<void>;
    //save: () => Promise<void>
    //append: (reviewEvent: NewReviewEvent) => ReviewEvent
    //appendReview: (problemId: ProblemId, sessionId: SessionId, quality: SolvedResult) => ReviewEvent
    //appendCancel: (targetEventId: ReviewEventId, sessionId: SessionId) => ReviewEvent
    //appendReset: (problemId: ProblemId) => ReviewEvent
    //clearAll: () => void
};

//function createReviewEventId(){ return v4()}

export const useReviewEventStore = create<ReviewEventStoreState>((set, get) => ({
    repo: undefined,
    setRepository: (repo) => set({ repo }),
    eventLog: [],
    //isDirty: false,

    reload: async () => {
        const repo = ensureRepo(get().repo)
        const data = await repo.findAll()
        set({ eventLog: data });        
    },
    replaceAll: (events) => {
        set({
            eventLog: events
        })
    },

    appendLocal: (event) => {

        set(state => ({
            eventLog: [
                ...state.eventLog,
                event
            ]
        }))
    },
    removeLocal: (eventId) => {
        set(state => ({
            eventLog:
                state.eventLog.filter(
                    e => e.id !== eventId
                )
        }))
    },
    rollback: (prev) => {
        set({
            eventLog: prev
        })
    },
    /*
    save: async () => {
        const repo = get().repo
        if (!repo) throw new Error("Repository not initialized")
        await repo.replaceAll(get().eventLog)
    },*/
    /*
    append: (newevent: NewReviewEvent): ReviewEvent => {
        const event: ReviewEvent = { ...newevent, id: createReviewEventId(), at: Date.now() }        
        set(state => ({
            //isDirty: true,
            eventLog: [...state.eventLog, event]
        }))
        //get().save()
        const repo = ensureRepo(get().repo)
        repo.append(event)
        useLearningRecordStore.getState().apply(event)  // learnig store も更新する

        return event
    },
    appendReview: (problemId: ProblemId, sessionId: SessionId, solvedResult: SolvedResult) => {
        const event: NewReviewEvent = {
            type: "reviewed",  
            problemId, sessionId: sessionId, solvedResult: solvedResult,
            //actions: actions
        }
        //console.log("append review", event)        
        return get().append(event);
    },
    appendReset: (problemId: ProblemId) => {
        const event: NewReviewEvent = {
            type: 
            "reset", problemId
        }
        return get().append(event)
    },
    
    */
}
));

function ensureRepo(repo: ReviewEventRepository | undefined): ReviewEventRepository {
    if (!repo) {
        throw new Error(
            "ReviewEventRepository not initialized"
        )
    }

    return repo
}