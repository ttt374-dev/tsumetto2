import { createProblemStore } from "../../application/store/useProblemStore"
import { Problem } from "../../domain/problem/Problem"
import { createLearningStore } from "../../application/store/useLearningStore"
import type { MissionItem } from "../../domain/missionItem/MissionItem"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { useStoreContext } from "../App/providers/StoreProvider"

export function useLibrary() {
    //const repos = useRepositoryContext()    
    const stores = useStoreContext()
    const { problems, addProblem, toggleStar, setTitle, clearAll } = stores.problem
    const { learningRecords, update: updateLearning } = stores.learning
   
    const missionItems: MissionItem[] = problems.map((p) => ({
        problem: p,
        learning: learningRecords[p.id]
    }))

    const handleAddProblem = async () => {
        addProblem(Problem.create())
    }
    const handleToggleStar = async (m: MissionItem) => {
        await toggleStar(m.problem)
        //await setTitle(m.problem, "asdfasdf")
    }
    const handleAnswer = async (m: MissionItem) => {
        const problemId = m.problem.id
        updateLearning(problemId, r => r.answer())
    }

    return { 
        problems, learningRecords, missionItems,

        handleAddProblem, handleToggleStar, handleAnswer, clearAll}
}