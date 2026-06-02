import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { SessionId } from "@/domain/session/entity/Session"

export const routePaths = {
    home: "/",

    // mission
    mission: "/missions",
    //missionEdit: (id: string) => `/missions/${id}`,
    missionEdit: {
        path: "/missions/:id",
        build: (id: string) => `/missions/${id}`
    },
    newMission: '/missions/new',

    // library
    library: "/library",
    //problemView: (id: ProblemId) => `/view/${id}`,
    player: {
        path: "/play/:id",
        build: (id: ProblemId) => `/play/${id}`,
    },
    //player: (id: ProblemId) => `/play/${id}`,

    // session
    session: "/session",
    //sessionPlay: "/session/play",
    sessionPlay: {
        path: "/session/:sessionId/play/:index",
        build: (sessionId: SessionId, index: number = 0) => `/session/${sessionId}/play/${index}`,
    },    
    sessionSummary: {
        path: "/session/:sessionId/summary",
        build: (sessionId: SessionId) => `/session/${sessionId}/summary`,
    },
    //sessionSummary: (sessionId: SessionId) => `/session/${sessionId}/summary`,
    sessionList: {
        path: "/session/:sessionId/list/:index",
        build:  (sessionId: SessionId, index: number = 0) => `/session/${sessionId}/list/${index}`,
    },    

    // detail
    detail: {
        path: "/detail/:id",
        build: (id: ProblemId) => `/detail/${id}`,
    },
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
    //back: -1

}
