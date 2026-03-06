import type { DeckId } from "@/domain/deck/entity/Deck";
import type { SolvedResult } from "@/domain/learning/entity/Learning";
import type { LearningEventId } from "@/domain/learning/entity/LearningEvent";
import type { MissionId, MissionPhase, MissionResultEntry } from "@/domain/mission/entity/Mission";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import { v4 } from "uuid";
import { create } from "zustand";


type MissionStore = {
    // ===== state =====
    missionId?: MissionId,
    deckId?: DeckId;
    problemIds: ProblemId[];
    currentIndex: number; // ⭐ マスター
    //answers: MissionResultEntry[];

    // ===== derived (必要最低限だけ) =====
    phase: () => MissionPhase

    // ===== command =====
    start: (deckId: DeckId, ids: ProblemId[]) => MissionId;
    //answer: (result: SolvedResult, secToTaken: number, learningEventId: LearningEventId) => void;
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
    missionId: undefined,
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
        const missionId = v4()
        set((_s) => {
            //console.log("start", deckId, ids, ids.length > 0 ? 0 : -1)
            return {
                deckId,
                missionId: missionId,
                problemIds: ids,
                currentIndex: ids.length > 0 ? 0 : -1,
                answers: [],
            }
        })
        return missionId
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
