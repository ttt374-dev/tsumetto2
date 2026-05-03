import { v4 } from "uuid";
import { create } from "zustand";

import type { MissionId } from "@/domain/mission/entity/Mission";
import type { ProblemId } from "@/domain/problem/entity/Problem";

type SessionStore = {
    missionId?: MissionId;
    problemIds: ProblemId[];
    start: (missionId: MissionId|undefined, ids: ProblemId[]) => void;
    //reset: () => void;
};

/////////////////////////////////////
export function createSessionId(){
    return v4()
}
export const useSessionStore = create<SessionStore>((set, get) => ({
    missionId: undefined,
    problemIds: [],
    currentIndex: 0,
    // ======================
    // command
    // ======================
    start: (missionId, ids) => {
        if (ids.length === 0) return    // 空だったらスタートしない

        set((_s) => {
            return {
                missionId: missionId,
                problemIds: ids,
            }
        })
    },

}));
