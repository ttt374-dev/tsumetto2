import { createProblemStore } from "../../application/store/useProblemStore"
import { Problem } from "../../domain/problem/Problem"
import { ProblemFileRepository } from "../../infra/problemRepository/ProblemFileRepository"
import { LearningFileRepository } from "../../infra/problemRepository/LearningFileRepository"
import { createLearningStore } from "../../application/store/useLearningStore"
import type { MissionItem } from "../../domain/missionItem/MissionItem"

export function useLibrary() {
    const problemRepo = new ProblemFileRepository()
    const { problems, addProblem, toggleStar, setTitle, clearAll } = createProblemStore(problemRepo)

    const learningRepo = new LearningFileRepository()
    const { learningRecords, update: updateLearning } = createLearningStore(learningRepo)

    
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