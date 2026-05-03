import type { Mission, MissionId } from "@/domain/mission/entity/Mission";
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import type { SessionId } from "@/domain/session/entity/Session";
import type { ParseSessionParamsResult } from "@/ui/screens/session/adaptor/parseSessionParams";

export type SessionPlayerViewModel =
    | { type: "error", message: string }
    | {
        type: "ready",
        problem: Problem;
        sessionId: SessionId;
        currentIndex: number;
        title: string
    }
    export type SessionPlayerInput = ParseSessionParamsResult & {
    ids: ProblemId[]
    byId: Record<ProblemId, Problem>

    missionId: MissionId | undefined
    missions: Mission[]
}