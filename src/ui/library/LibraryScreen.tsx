import { Button, List, ListItem } from "@mui/material"
import { useEffect } from "react"
import { useLibrary } from "./useLibrary"

type Props = {

}

export function LibraryScreen({ }: Props) {
    const { problems, learningRecords, missionItems,
        handleAddProblem, handleToggleStar, handleAnswer, clearAll}  = useLibrary()
   
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


            <List>
                {missionItems.map((m, i) => (
                    <ListItem key={m.problem.id}>
                       [{i}] {m.problem.id} {m.problem.title} [{m.problem.starred ? "★" : "☆"}] / 
                        {m.learning?.solvedCount}
                        <Button onClick={() => handleToggleStar(m)}>
                            Toggle Stars
                        </Button>
                       <Button onClick={() => { handleAnswer(m)}}>
                            Answer
                        </Button>
                    </ListItem>
                ))}
            </List>
        </>
    )
}