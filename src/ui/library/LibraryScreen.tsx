import { Button, List, ListItem } from "@mui/material"
import { useEffect } from "react"
import { useMissionItem } from "../../application/useMissionItem"
import { Problem } from "@/domain/problem/Problem"
import { useFileSelector } from "../sharedComponents/useFileSelector"

export function LibraryScreen() {
    const { problems, learningRecords, missionItems,
        sortState, setSortState, filterState, setFilterState,
        addProblems,
        toggleSort, toggleFilter, 
        toggleStar, markAnswer, clearAll}  = useMissionItem()

    const { openFileDialog, inputElement, setOnFilesSelected } = useFileSelector(".kif")
   
    useEffect(()=>{
        console.log("library screen", problems, learningRecords)
    }, [problems])    
    

    setOnFilesSelected((filelist) => {
        const files = Array.from(filelist)                
        const problems = files.map((f) => (
            Problem.createFromText("text", f.name)
    ))
        addProblems(problems)
    })

    return (
        <>
            <Button onClick={openFileDialog}>
                Import
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
                       <Button onClick={() => { markAnswer(m, "solved")}}>
                            Answer
                        </Button>
                    </ListItem>
                ))}
            </List>

            {inputElement}
        </>
    )
}