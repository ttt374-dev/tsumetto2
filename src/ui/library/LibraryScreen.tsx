import { Button, List, ListItem } from "@mui/material"
import { createProblemStore } from "../../application/store/useProblemStore"
import { Problem, type ProblemId } from "../../domain/problem/Problem"
import { ProblemFileRepository } from "../../infra/problemRepository/ProblemFileRepository"
import { useEffect } from "react"
import { LearningFileRepository } from "../../infra/problemRepository/LearningFileRepository"
import { createLearningStore } from "../../application/store/useLearningStore"
import { Learning } from "../../domain/learning/Learning"

type Props = {

}
type MissionItem = {
    problem: Problem, learning?: Learning
}
export function LibraryScreen({ }: Props) {
    const problemRepo = new ProblemFileRepository()
    const { problems, addProblem, toggleStar, setTitle, clearAll } = createProblemStore(problemRepo)

    const learningRepo = new LearningFileRepository()
    const { learningRecords, update } = createLearningStore(learningRepo)

    const missionItems: MissionItem[] = problems.map((p)=> ({
        problem: p, 
        learning: learningRecords[p.id]
    }))
    const handleAddProblem = async () => {
        addProblem(Problem.create())
    }
    const handleToggleStars = async () => {
        await toggleStar(problems[0])
        await setTitle(problems[0], "asdfasdf")
    }
    const handleAnswer = async () => {
        //console.log("answer", learningRecords)
        const problemId: ProblemId = problems[1].id
        update(problemId, r => Learning.create(
            problemId,
            {solvedCount: r.solvedCount+1}
        ))
    }

    useEffect(()=>{
        console.log("library screen", problems, learningRecords)
    }, [problems])
    return (
        <>
            <Button onClick={handleAddProblem}>
                add
            </Button>
            <Button onClick={clearAll}>
                clear all
            </Button>
            <Button onClick={handleToggleStars}>
                Toggle Stars
            </Button>

            <Button onClick={handleAnswer}>
                Answer
            </Button>

            <List>
                {missionItems.map((m, i) => (
                    <ListItem key={m.problem.id}>
                       [{i}] {m.problem.id} {m.problem.title} [{m.problem.starred ? "★" : "☆"}] / 
                       {m.learning?.solvedCount}
                    </ListItem>
                ))}
            </List>
        </>
    )
}