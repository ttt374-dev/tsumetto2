import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"

export const routes = {
    home: "/",

    // mission
    mission: "/missions",
    missionEdit: (id: string) => `/missions/${id}`,
    newMission: '/missions/new',

    // library
    library: "/library",
    //problemView: (id: ProblemId) => `/view/${id}`,
    player: (id: ProblemId) => `/play/${id}`,

    // session
    session: "/session",
    //sessionPlay: "/session/play",
    sessionPlay: (sessionId: SessionId, index: number = 0) => `/session/${sessionId}/play/${index}`,
    //sessionSummary: "/session/summary",
    sessionSummary: (sessionId: SessionId) => `/session/${sessionId}/summary`,
    sessionList: (sessionId: SessionId, index: number = 0) => `/session/${sessionId}/list/${index}`,

    // detail
    detail: (id: ProblemId) => `/detail/${id}`,

    // view
    view: (id: ProblemId) => `/view/${id}`,

    // list
    list: "/list",

    // stats
    stats: "/stats",

    // history,
    history: "/history",

    maintenance: "/maintenance",
    // settings
    settings: "/settings",
    
    // back
    back: -1

}
