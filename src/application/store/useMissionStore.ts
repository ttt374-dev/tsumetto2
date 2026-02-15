import type { SolvedResult } from "@/domain/learning/Learning";
import type { MissionResultEntry } from "@/domain/MissionEvent/MissionEvent";
import type { ProblemId } from "@/domain/problem/Problem";
import { create } from "zustand";

export type MissionPhase =
    | "idle"
    | "playing"
    | "finished";

export type MissionSnapshot = {
    //deckId?: string;
    problemIds: ProblemId[];
    currentProblemId?: ProblemId;
    answers:  MissionResultEntry[] // Record<ProblemId, SolvedResult>;
};

type MissionStore = {
    snapshot: MissionSnapshot;

    // derived
    phase: () => MissionPhase;

    // query
    index: () => number;
    count: () => number;
    isFirst: () => boolean;
    isLast: () => boolean;
    //currentProblemId: () => ProblemId | undefined;

    // command
    start: (ids: ProblemId[]) => void;
    answer: (result: SolvedResult) => void;
    next: () => void;
    prev: () => void;
    moveTo: (id: ProblemId) => void;
    reset: () => void;
};

////////////////////////////

const initialSnapshot: MissionSnapshot = {
    problemIds: [],
    currentProblemId: undefined,
    answers: [],
};

export const useMissionStore = create<MissionStore>((set, get) => ({
    snapshot: initialSnapshot,

    // ======================
    // derived
    // ======================
    phase: () => {
        const { problemIds, currentProblemId } = get().snapshot;

        if (problemIds.length === 0) return "idle";
        if (!currentProblemId) return "finished";
        return "playing";
    },

    // ======================
    // query
    // ======================
    //currentProblemId: () => get().snapshot.currentProblemId,
    index: () => {
        const { problemIds, currentProblemId } = get().snapshot;
        if (!currentProblemId) return -1;
        return problemIds.indexOf(currentProblemId);
    },

    count: () => get().snapshot.problemIds.length,

    isFirst: () => get().index() === 0,

    isLast: () => {
        const i = get().index();
        const total = get().count();
        return i === total - 1;
    },

    // ======================
    // command
    // ======================
    start: (ids: ProblemId[]) =>
        set({
            snapshot: {
                //deckId,
                problemIds: ids,
                currentProblemId: ids[0],
                answers: []
                //answers: Object.fromEntries(
                //    ids.map(id => [id, "unanswered"])
                //),
            },
        }),

    answer: (result) =>
        set((s) => {
            const { currentProblemId, answers } = s.snapshot;
            if (!currentProblemId) return s;

            console.log("answer", result, answers)
            return {
                snapshot: {
                    ...s.snapshot,
                    answers: [...answers, {
                        problemId: currentProblemId,
                        solvedResult: result,
                    }],
                },
            };
        }),

    next: () =>
        set((s) => {
            const { problemIds, currentProblemId } = s.snapshot;
            if (!currentProblemId) return s;

            const index = problemIds.indexOf(currentProblemId);
            const nextId = problemIds[index + 1];

            return {
                snapshot: {
                    ...s.snapshot,
                    currentProblemId: nextId,
                },
            };
        }),

    prev: () =>
        set((s) => {
            const { problemIds, currentProblemId } = s.snapshot;
            if (!currentProblemId) return s;

            const index = problemIds.indexOf(currentProblemId);
            const prevId = problemIds[index - 1] ?? currentProblemId;

            return {
                snapshot: {
                    ...s.snapshot,
                    currentProblemId: prevId,
                },
            };
        }),

    moveTo: (id) =>
        set((s) => {
            if (!s.snapshot.problemIds.includes(id)) return s;

            return {
                snapshot: {
                    ...s.snapshot,
                    currentProblemId: id,
                },
            };
        }),

    reset: () =>
        set({
            snapshot: initialSnapshot,
        }),
}));
