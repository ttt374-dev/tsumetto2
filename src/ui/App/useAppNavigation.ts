import type { ProblemId } from "@/domain/problem/entity/Problem"

export const routes = {
    home: "/",

    // deck
    mission: "/missions",
    missionEdit: (id: string) => `/missions/${id}`,
    newMission: '/missions/new',

    // library
    library: "/library",
    problemView: (id: ProblemId) => `/view/${id}`,
    player: (id: ProblemId) => `/play/${id}`,

    // session
    session: "/session",
    sessionPlay: "/session/play",
    sessionSummary: "/session/summary",

    // detail
    detail: (id: ProblemId) => `/detail/${id}`,

    // list
    list: "/list",

    // stats
    stats: "/stats",
    
    // back
    back: -1

}
