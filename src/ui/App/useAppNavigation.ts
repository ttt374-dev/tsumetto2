import type { ProblemId } from "@/domain/problem/entity/Problem"

export const routes = {
    home: "/",

    // mission
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
    sessionList: "/session/list",

    // detail
    detail: (id: ProblemId) => `/detail/${id}`,

    // list
    list: "/list",

    // stats
    stats: "/stats",

    // history,
    history: "/history",
    
    // back
    back: -1

}
