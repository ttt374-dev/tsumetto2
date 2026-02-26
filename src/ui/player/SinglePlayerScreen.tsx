import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import { useLearningEventStore } from "../store/useLearningEventStore"
import { PlayerScreen } from "./PlayerScreen"
import type { SolvedResult } from "@/domain/learning/entity/Learning"
import { useNavigate, useParams } from "react-router-dom"
import { useProblemStore } from "../store/useProblemStore"
import { routes } from "../App/useAppNavigation"

export function SinglePlayerScreen() {    
    const { id } = useParams<{ id: string }>()
    const problem = useProblemStore(s => id ? s.byId[id] : undefined)
        if (!problem) return <div>Not found</div>

    return SinglePlayContent(problem)
}

function SinglePlayContent(problem: Problem){
    const navigate = useNavigate()
    const review = useLearningEventStore(s => s.review)
    const handleAnswered = (res: SolvedResult, sec?: number) => {        
        review(problem.id, res, sec)
        navigate(routes.back)
    }
    const capabilities = {        
        answer: { answer: handleAnswered }
    }

    return (
        <PlayerScreen
            problem={problem}
            title={problem.title}
            capabilities={capabilities}
        />
    )
}