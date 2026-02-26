import type { ProblemId } from "@/domain/problem/entity/Problem"
import { useNavigate } from "react-router-dom"

export const routes = {
    home: "/",

    // deck
    decks: "/decks",
    deckEdit: (id: string) => `/deck/${id}`,
    deckNew: '/deck/new',

    // library
    library: "/library",
    problemView: (id: ProblemId) => `/view/${id}`,
    player: (id: ProblemId) => `/play/${id}`,

    // mission
    mission: "/mission",
    missionPlay: "/mission/play",
    missionSummary: "/mission/summary",

    // list
    list: "/list",

    // stats
    stats: "/stats",
    
    // back
    back: -1

}

