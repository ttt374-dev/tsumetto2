import { v4 } from "uuid";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { MissionId } from "@/domain/mission/entity/Mission";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { SessionId } from "@/domain/session/entity/Session";

type SessionStore = {
    activeSessionId?: SessionId
    missionId?: MissionId
    problemIds: ProblemId[]

    start: (
        sessionId: SessionId,
        ids: ProblemId[],
        missionId?: MissionId
    ) => void

    reset: () => void
}

/////////////////////////////////////
export function createSessionId() {
    return v4()
}

export const useSessionStore = create<SessionStore>()(
    persist(
        (set) => ({
            activeSessionId: undefined,
            missionId: undefined,
            problemIds: [],

            start: (sessionId, ids, missionId) => {
                if (!sessionId || ids.length === 0) return

                set({
                    activeSessionId: sessionId,
                    missionId,
                    problemIds: ids,
                })
            },

            reset: () => {
                set({
                    activeSessionId: undefined,
                    missionId: undefined,
                    problemIds: [],
                })
            },
        }),
        {
            name: "session-storage",
            // localStorage ではなく sessionStorage にしたいなら
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)