import { v4 } from "uuid";
import { create } from "zustand";

import type { MissionId } from "@/domain/mission/entity/Mission";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import type { SessionId } from "@/domain/session/entity/Session";

type SessionStore = {
    activeSessionId?: SessionId,
    missionId?: MissionId;
    problemIds: ProblemId[];
    start: (sessionId: SessionId, ids: ProblemId[], missionId?: MissionId|undefined, ) => void;
    //reset: () => void;
};

/////////////////////////////////////
export function createSessionId(){
    return v4()
}
export const useSessionStore = create<SessionStore>((set, get) => ({
    activeSessionId: undefined,
    missionId: undefined,
    problemIds: [],
    currentIndex: 0,
    // ======================
    // command
    // ======================
    start: (sessionId, ids, missionId) => {
        if (sessionId === undefined || ids.length === 0) return    // 空だったらスタートしない
        alert(sessionId)
        set((_s) => {
            return {
                activeSessionId: sessionId,                
                problemIds: ids,
                missionId,
            }
        })
    },

}));
