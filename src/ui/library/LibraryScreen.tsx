import { Button, List, ListItem } from "@mui/material"
import { createProblemStore } from "../../application/store/useProblemStore"
import { Problem } from "../../domain/problem/Problem"
import { FileProblemRepository } from "../../infra/problemRepository/ProblemFileRepository"

type Props = {

}
export function LibraryScreen({ }: Props) {
    const repo = new FileProblemRepository()
    const { problems, add, clearAll } = createProblemStore(repo)

    const addProblem = () => {
        const newProblem = Problem.create()
        add(newProblem)
    }
    
    return (
        <>
            <Button onClick={addProblem}>
                add
            </Button>
            <Button onClick={clearAll}>
                clear all
            </Button>


            <List>
                {problems.map((p, i) => (
                    <ListItem>
                       [{i}] {p.id}
                    </ListItem>
                ))}
            </List>


        </>
    )
}