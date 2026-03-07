import type { DeckId } from "@/domain/deck/entity/Deck";
import type { SessionId, SessionPhase } from "@/domain/session/entity/Session";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import { v4 } from "uuid";
import { create } from "zustand";


type SesionStore = {
    // ===== state =====
    sessionId?: SessionId,
    deckId?: DeckId;
    problemIds: ProblemId[];
    currentIndex: number; // ⭐ マスター

    // ===== derived (必要最低限だけ) =====
    phase: () => SessionPhase

    // ===== command =====
    start: (deckId: DeckId, ids: ProblemId[]) => SessionId;
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
    deckId: undefined,
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
    start: (deckId, ids) => {
        const sessionId = v4()
        set((_s) => {
            //console.log("start", deckId, ids, ids.length > 0 ? 0 : -1)
            return {
                deckId,
                sessionId: sessionId,
                problemIds: ids,
                currentIndex: ids.length > 0 ? 0 : -1,
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
            deckId: undefined,
            problemIds: [],
            currentIndex: -1,
            //answers: [],
        }),
}));
