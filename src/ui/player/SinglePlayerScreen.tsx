import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { useLearningEventStore } from "../store/useLearningEventStore"
import { PlayerScreen } from "./PlayerScreen"
import type { SolvedResult } from "@/domain/learning/entity/Learning"
import { useNavigate, useParams } from "react-router-dom"
import { useProblemStore } from "../store/useProblemStore"
import { routes } from "../App/useAppNavigation"
import { useMissionStore } from "../store/useMissionStore"

export function SinglePlayerScreen() {    
    const { id } = useParams<{ id: string }>()
    const problem = useProblemStore(s => id ? s.byId[id] : undefined)
        if (!problem) return <div>Not found</div>

    return SinglePlayerContent(problem)
}

const SINGLE_DECK_ID="single-deck-id"

function SinglePlayerContent(problem: Problem){
    const navigate = useNavigate()
    const startMission = useMissionStore(s=>s.start)
    const missionId = useMissionStore(s=>s.missionId)
    const review = useLearningEventStore(s=>s.appendReview)

    const capabilities = {
        answerable: {
            answer: (problemId: ProblemId, res: SolvedResult, sec?: number) => {
                if (!missionId) return
                startMission(SINGLE_DECK_ID, [problemId])
                review(problemId, missionId, res, sec)
                navigate(routes.back)
            }
        }
    }

    return (
        <PlayerScreen
            problem={problem}
            title={problem.title}
            capabilities={capabilities}
        />
    )
}