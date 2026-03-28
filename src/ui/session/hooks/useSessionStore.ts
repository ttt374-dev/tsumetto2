import type { MissionId } from "@/domain/mission/entity/Mission";
import type { SessionId, SessionPhase } from "@/domain/session/entity/Session";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import { v4 } from "uuid";
import { create } from "zustand";
import type { SolvedResult } from "@/domain/review/solvedResult"
import { AddAlertRounded } from "@mui/icons-material";

type SessionStore = {
    // ===== state =====
    sessionId?: SessionId,
    missionId?: MissionId;
    problemIds: ProblemId[];
    currentIndex: number; // ⭐ マスター
    results: Record<ProblemId, SolvedResult>

    // ===== derived (必要最低限だけ) =====
    phase: () => SessionPhase

    // ===== command =====
    start: (missionId: MissionId, ids: ProblemId[], startIndex?: number) => SessionId;
    next: () => void;
    prev: () => void;
    moveToIndex: (index: number) => void;
    moveToId: (id: ProblemId) => void;
    summary: () => void;
    submitResult: (id: ProblemId, res: SolvedResult | undefined) => void
    reset: () => void;
};

/////////////////////////////////////

export const useSessionStore = create<SessionStore>((set, get) => ({
    // state
    missionId: undefined,
    sessionId: undefined,
    problemIds: [],
    currentIndex: -1,
    results: {},

    // derived
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
    start: (missionId, ids, startIndex=0) => {
        const sessionId = v4()
        set((_s) => {
            //console.log("start", missionId, ids, ids.length > 0 ? 0 : -1)
            return {
                missionId: missionId,
                sessionId: sessionId,
                problemIds: ids,
                currentIndex: ids.length > startIndex ? startIndex : -1,
                results: {},
                //answers: [],
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

    summary: () => {
        set((s) => ({
            currentIndex: s.problemIds.length
        }))
    },
    submitResult: (id: ProblemId, res: SolvedResult | undefined) => {
        set(s => {
            const newResults = { ...s.results }

            if (res === undefined) {
                delete newResults[id]
            } else {
                newResults[id] = res
            }
            return { results: newResults }
        })
    },

    reset: () =>
        set({
            missionId: undefined,
            problemIds: [],
            currentIndex: -1,
            results: {},
            //answers: [],
        }),
}));
