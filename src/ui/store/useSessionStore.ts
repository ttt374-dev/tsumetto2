import type { MissionId } from "@/domain/mission/entity/Mission";
import type { SessionId, SessionPhase } from "@/domain/session/entity/Session";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import { v4 } from "uuid";
import { create } from "zustand";


type SesionStore = {
    // ===== state =====
    sessionId?: SessionId,
    missionId?: MissionId;
    problemIds: ProblemId[];
    currentIndex: number; // ⭐ マスター

    // ===== derived (必要最低限だけ) =====
    phase: () => SessionPhase

    // ===== command =====
    start: (deckId: MissionId, ids: ProblemId[], startIndex?: number) => SessionId;
    //answer: (result: SolvedResult, secToTaken: number, learningEventId: LearningEventId) => void;
    next: () => void;
    prev: () => void;
    moveToIndex: (index: number) => void;
    moveToId: (id: ProblemId) => void;
    reset: () => void;
};

/////////////////////////////////////

export const useSessionStore = create<SesionStore>((set, get) => ({
    // ======================
    // state
    // ======================
    missionId: undefined,
    sessionId: undefined,
    problemIds: [],
    currentIndex: -1,
    //answers: [],
    
    // ======================
    // derived
    // ======================

    phase: () => {
        const { problemIds, currentIndex } = get();

        if (problemIds.length === 0) return "idle";
        if (currentIndex < 0 || currentIndex >= problemIds.length)
            return "finished";
        return "playing";
    },

    // ======================
    // command
    // ======================
    start: (deckId, ids, startIndex=0) => {
        const sessionId = v4()
        set((_s) => {
            //console.log("start", deckId, ids, ids.length > 0 ? 0 : -1)
            return {
                missionId: deckId,
                sessionId: sessionId,
                problemIds: ids,
                currentIndex: ids.length > startIndex ? 0 : -1,
                answers: [],
            }
        })
        return sessionId
    },

    next: () =>
        set((s) => {
            const nextIndex = s.currentIndex + 1;

            if (nextIndex >= s.problemIds.length) {
                return { currentIndex: s.problemIds.length }; // finished状態
            }

            return { currentIndex: nextIndex };
        }),

    prev: () =>
        set((s) => {
            const prevIndex = s.currentIndex - 1;
            return {
                currentIndex: prevIndex < 0 ? 0 : prevIndex,
            };
        }),

    moveToIndex: (index) =>
        set((s) => {
            if (index < 0 || index >= s.problemIds.length) return s;
            return { currentIndex: index };
        }),

    moveToId: (id) =>
        set((s) => {
            const index = s.problemIds.indexOf(id);
            if (index === -1) return s;
            return { currentIndex: index };
        }),

    reset: () =>
        set({
            missionId: undefined,
            problemIds: [],
            currentIndex: -1,
            //answers: [],
        }),
}));
