import { Button, List, ListItem } from "@mui/material"
import { createProblemStore } from "../../application/store/useProblemStore"
import { Problem } from "../../domain/problem/Problem"
import { FileProblemRepository } from "../../infra/problemRepository/ProblemFileRepository"
import { useEffect } from "react"

type Props = {

}
export function LibraryScreen({ }: Props) {
    const repo = new FileProblemRepository()
    const { problems, addProblem, toggleStar, setTitle, clearAll } = createProblemStore(repo)

    const handleAddProblem = async () => {
        addProblem(Problem.create())
    }
    const handleToggleStars = async () => {
        await toggleStar(problems[0])
        await setTitle(problems[0], "asdfasdf")
    }

    useEffect(()=>{
        console.log("library screen", problems)
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


            <List>
                {problems.map((p, i) => (
                    <ListItem key={p.id}>
                       [{i}] {p.id} {p.title} [{p.starred ? "★" : "☆"}]
                    </ListItem>
                ))}
            </List>


        </>
    )
}