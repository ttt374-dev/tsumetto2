import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import type { SessionId } from "@/domain/session/entity/Session";
import type { Mission, MissionId } from "@/domain/mission/entity/Mission";
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
//////////////////////////////////////////////////////
export function buildSessionPlayerVieModel(input: SessionPlayerInput): SessionPlayerViewModel {
    if (input.type === "invalid") return { type: "error", message: "invalid params" }
    const { sessionId, index, ids, byId, missionId, missions } = input

    if (index < 0) {
        return { type: "error", message: "invalid currentIndex" }
    }
    if (!ids.length || index >= ids.length) {
        return { type: "error", message: "Invalid index" }
    }
    const pid = ids[index]
    const problem = pid ? byId[pid] : undefined
    if (!problem) {
        return { type: "error", message: `Problem not found: ${pid}` }
    }

    // title
    const titleProps = {
        index: index,
        count: ids?.length ?? 0,
        problemTitle: problem?.title,
        missionName: missions.find(d=>d.id===missionId)?.name ?? ""
    }
    const title = buildSessionPlayerTitle(titleProps)

    return {
        type: "ready",
        problem, sessionId, currentIndex: index, title,
    }

}

export function buildSessionPlayerTitle(props: {
    missionName: string,
    index: number,
    count: number,
    problemTitle: string
}){
    return `[${props.missionName} (${props.index + 1}/${props.count})]: ${props.problemTitle}`   
}