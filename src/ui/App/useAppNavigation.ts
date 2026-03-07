import type { ProblemId } from "@/domain/problem/entity/Problem"

export const routes = {
    home: "/",

    // deck
    mission: "/deck",
    missionEdit: (id: string) => `/mission/${id}`,
    newMission: '/mission/new',

    // library
    library: "/library",
    problemView: (id: ProblemId) => `/view/${id}`,
    player: (id: ProblemId) => `/play/${id}`,

    // session
    session: "/session",
    sessionPlay: "/session/play",
    sessionSummary: "/session/summary",

    // list
    list: "/list",

    // stats
    stats: "/stats",
    
    // back
    back: -1

}
