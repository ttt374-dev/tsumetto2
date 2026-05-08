import type { SessionPlayerInput, SessionPlayerViewModel } from "@/ui/screens/session/vm/SessionPlayerViewModel";


//////////////////////////////////////////////////////
export function buildSessionPlayerVieModel(input: SessionPlayerInput): 
    SessionPlayerViewModel {
    if (input.type === "invalid") return { type: "error", message: "invalid params" }
    const { sessionId, index, ids, byId, missionId, missions, activeSessionId } = input

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
    if (activeSessionId !== sessionId){
        return { type: "error", message: `current sessoin Id is not active: ${sessionId} vs active of ${activeSessionId}` }
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