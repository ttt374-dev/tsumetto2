import { useNavigate } from "react-router-dom"

export const routes = {
    home: "/",

    // deck
    decks: "/decks",
    deckEdit: (id: string) => `/deck/${id}`,
    deckNew: '/deck/new',

    // library
    library: "/library",
    problemView: (id: string) => `/view/${id}`,

    // mission
    mission: "/mission",
    missionPlay: "/mission/play",
    missionSummary: "/mission/summary",

    // back
    back: -1

}

