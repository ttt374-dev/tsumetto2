import { create } from "zustand";

import type { ReviewEvent, ReviewEventLog } from "@/domain/review/ReviewEvent";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import { projectLearningState, reduceLearningState } from "@/domain/learning/service/projectLearningState";
import type { LearningState } from "@/domain/learning/entity/LearningState";
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore";

type LearningRecordStoreState = {
    //records: LearningRecord;
    stateRecords: Record<ProblemId, LearningState>
    //getState: (id: ProblemId) => LearningState

    build: (eventLog: ReviewEventLog) => void;
    apply: (event: ReviewEvent) => void
    getLearningState: (problemId: ProblemId) => LearningState | undefined
};

export const useLearningRecordStore = create<LearningRecordStoreState>((set, get) => ({
    //records: {},
    stateRecords: {},
    //getState: (id: ProblemId) => get().stateRecords[id],

    build: (eventLog) => {
        set({
            //records: projectLearning(eventLog),
            stateRecords: projectLearningState(eventLog),
        });
    },
    apply: (event) => {
        set(state => {
            const next = { ...state.stateRecords }

            switch (event.type) {
                case "reviewed":
                    next[event.problemId] =
                        reduceLearningState(
                            next[event.problemId],
                            event
                        )
                    break

                case "reset":
                    delete next[event.problemId]
                    break
            }

            return { stateRecords: next }
        })
    },
    getLearningState: (pid) => {
        return get().stateRecords[pid]
    }
}));

// review event append で learning store を apply で更新するようにしたので、
// 下記 subscription は不要
let unsubscribe: (() => void) | undefined

export function initializeLearningRecordSync() {
    if (unsubscribe) return

    unsubscribe = useReviewEventStore.subscribe((state) => {
        useLearningRecordStore
            .getState()
            .build(state.eventLog)
    })

    // 初回同期
    useLearningRecordStore
        .getState()
        .build(
            useReviewEventStore.getState().eventLog
        )
}

export function disposeLearningRecordSync() {
    unsubscribe?.()
    unsubscribe = undefined
}
/*
// --- 自動同期用のサブスクライバ ---
useReviewEventStore.subscribe((state) => {
    // state は store 全体
    useLearningRecordStore.getState().updateFromEventLog(state.eventLog);
});
*/