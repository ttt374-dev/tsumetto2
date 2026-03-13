import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { useLearningEventStore } from "../store/useLearningEventStore"
import PlayerScreen from "./PlayerScreen"
import type { SolvedResult } from "@/domain/learning/entity/Learning"
import { useNavigate, useParams } from "react-router-dom"
import { useProblemStore } from "../store/useProblemStore"
import { routes } from "../App/useAppNavigation"
import { useSessionStore } from "../store/useSessionStore"

export default function SinglePlayerScreen() {    
    const { id } = useParams<{ id: string }>()
    const problem = useProblemStore(s => id ? s.byId[id] : undefined)
    if (!problem) return <div>Not found</div>

    return (
        <SinglePlayerContent problem={problem} />)

}

const SINGLE_MISSION_ID="single-mission-id"

function SinglePlayerContent({problem} : { problem: Problem}){
    const navigate = useNavigate()
    const startSession = useSessionStore(s=>s.start)
    const appendreview = useLearningEventStore(s=>s.appendReview)
    
    const submitAnswer = (res: SolvedResult) => {
        const sessionId = startSession(SINGLE_MISSION_ID, [problem.id])
        if (!sessionId) return
        appendreview(problem.id, sessionId, res)
        //navigate(routes.back)
        //next()
    }    
    return (
        <PlayerScreen
            problem={problem}
            title={problem.title}
            onResolved={submitAnswer}
        />
    )
}