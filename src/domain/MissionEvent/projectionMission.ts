import type { MissionEvent, MissionSnapshot } from "./MissionEvent"

export function projectMission(
    events: MissionEvent[]
): MissionSnapshot {
    let snapshot: MissionSnapshot = {
        missionId: "",
        phase: "playing",
        problemIds: [],
        answered: {},
        solvedCount: 0,
        failedCount: 0,
    }

    for (const e of events) {
        switch (e.type) {
            case "MissionStarted":
                snapshot = {
                    ...snapshot,
                    missionId: e.missionId,
                    phase: "playing",
                    problemIds: e.problemIds,
                }
                break

            case "MissionProblemAnswered":
                snapshot.answered[e.problemId] = e
                if (e.result === "solved") snapshot.solvedCount++
                else snapshot.failedCount++
                break

            case "MissionFinished":
                snapshot.phase = "finished"
                break
        }
    }

    return snapshot
}
