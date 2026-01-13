import { Button, List, ListItem } from "@mui/material"
import { useEffect } from "react"
import { useMissionItem } from "../../application/useMissionItem"

export function LibraryScreen() {
    const { problems, learningRecords, missionItems,
        sortState, setSortState, filterState, setFilterState,
        toggleSort, toggleFilter, 
        addProblem, toggleStar, handleAnswer, clearAll}  = useMissionItem()
   
    useEffect(()=>{
        console.log("library screen", problems, learningRecords)
    }, [problems])    
    
    return (
        <>
            <Button onClick={addProblem}>
                add
            </Button>
            <Button onClick={clearAll}>
                clear all
            </Button>
            <Button onClick={() => { toggleSort('createdAt')}}>
                toggle sort
            </Button>
            <Button onClick={() => { toggleFilter('starredOnly')}}>
                starred only: { filterState.starredOnly ? "Star": "-"}
            </Button>

            <List>
                {missionItems.map((m, i) => (
                    <ListItem key={m.problem.id}>
                       [{i}] {m.problem.id} {m.problem.title} /
                       at { new Date(m.problem.createdAt).toLocaleString()}
                       [{m.problem.starred ? "★" : "☆"}] / 
                        {m.learning?.solvedCount}
                        <Button onClick={() => toggleStar(m)}>
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