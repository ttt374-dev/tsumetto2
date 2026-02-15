import type { DeckId } from "@/domain/deck/Deck";
import type { SolvedResult } from "@/domain/learning/Learning";
import type { MissionResultEntry } from "@/domain/MissionEvent/MissionEvent";
import type { ProblemId } from "@/domain/problem/Problem";
import { create } from "zustand";

export type MissionPhase =
    | "idle"
    | "playing"
    | "finished";

type MissionStore = {
    // ===== state =====
    deckId?: DeckId;
    problemIds: ProblemId[];
    currentIndex: number; // ⭐ マスター
    currentProblemId: ProblemId;
    answers: MissionResultEntry[];

    // ===== derived (必要最低限だけ) =====
    isFirst: boolean
    isLast: boolean
    phase: MissionPhase
    count: number

    // ===== command =====
    start: (deckId: DeckId, ids: ProblemId[]) => void;
    answer: (result: SolvedResult) => void;
    next: () => void;
    prev: () => void;
    moveToIndex: (index: number) => void;
    moveToId: (id: ProblemId) => void;
    reset: () => void;
};

/////////////////////////////////////

export const useMissionStore = create<MissionStore>((set, get) => ({
    // ======================
    // state
    // ======================
    deckId: undefined,
    problemIds: [],
    currentIndex: -1,
    answers: [],
    
    // ======================
    // derived
    // ======================
    get isFirst(){
        return get().currentIndex === 0
    },
    get isLast(){
        const { currentIndex, problemIds } = get();
        return currentIndex === problemIds.length - 1;
    },

    get phase(){
        const { problemIds, currentIndex } = get();

        if (problemIds.length === 0) return "idle";
        if (currentIndex < 0 || currentIndex >= problemIds.length)
            return "finished";
        return "playing";
    },
    get count(){ return get().problemIds.length},
    get currentProblemId(){ return get().problemIds[get().currentIndex]},

    // ======================
    // command
    // ======================
    start: (deckId, ids) =>
        set({
            deckId,
            problemIds: ids,
            currentIndex: ids.length > 0 ? 0 : -1,
            answers: [],
        }),

    answer: (result) =>
        set((s) => {
            const { currentIndex, problemIds, answers } = s;
            if (currentIndex < 0) return s;

            const problemId = problemIds[currentIndex];
            return {
                answers: [
                    ...answers,
                    {
                        problemId,
                        solvedResult: result,
                    },
                ],
            };
        }),

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
            answers: [],
        }),
}));
