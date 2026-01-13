import { Button, List, ListItem } from "@mui/material"
import { useEffect } from "react"
import { useLibrary } from "./useLibrary"

export function LibraryScreen() {
    const { problems, learningRecords, missionItems,
        sortState, setSortState, filterState, setFilterState,
        handleToggleSort, handleStarredOnly,
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
            <Button onClick={handleToggleSort}>
                toggle sort
            </Button>
            <Button onClick={handleStarredOnly}>
                starred only: { filterState.starredOnly ? "Star": "-"}
            </Button>

            <List>
                {missionItems.map((m, i) => (
                    <ListItem key={m.problem.id}>
                       [{i}] {m.problem.id} {m.problem.title} /
                       at { new Date(m.problem.createdAt).toLocaleString()}
                       [{m.problem.starred ? "★" : "☆"}] / 
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