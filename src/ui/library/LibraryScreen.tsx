import { Box, Button, List, ListItem, Stack } from "@mui/material"
import { useEffect } from "react"
import { useMissionItem } from "../../application/useMissionItem"
import { Problem } from "@/domain/problem/Problem"
import { useFileSelector } from "../sharedComponents/useFileSelector"
import { useToast } from "../App/providers/ToastProvider"
import type { MissionItem } from "@/domain/missionItem/MissionItem"
import { AppLayout } from "../common/AppLayout"
import { createImportProblemsUsecase, type ImportResult } from "@/usecase/importProblemsUseCase"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { useRouteLoaderData } from "react-router-dom"

export function useLibrary() {
    const repos = useRepositoryContext()

    const importFiles = async (files: File[]): Promise<ImportResult> => {
        const usecase = createImportProblemsUsecase(repos.problem)    
        return await usecase.importFiles(files)        
    }

    return {
        importFiles
    }
}

export function LibraryScreen() {
    const { problems, learningRecords, missionItems, reload,
        sortState, setSortState, filterState, setFilterState,
        addProblems, deleteProblem,
        toggleSort, toggleFilter,
        toggleStar, markAnswer, clearAll } = useMissionItem()

    const { openFileDialog, inputElement, setOnFilesSelected } = useFileSelector(".kif")
    const toast = useToast()

    useEffect(() => {
        //console.log("library screen", problems, learningRecords)
    }, [problems])

    const { importFiles } = useLibrary()

    setOnFilesSelected( (filelist) => {
        const files = Array.from(filelist)
        importFiles(files).then((r)=> {
            console.log("imported", r)
            reload()
            toast({message: `import files`})
        })
        
    })
    const handleDelete = (m: MissionItem) => {
        if (!window.confirm("ok to delete ? ")) return
        deleteProblem(m.problem.id).then(() => {
            toast({ message: "deleted" })
        })
    }

    return (
        <AppLayout>
            <Stack direction="row">
                <Button onClick={openFileDialog}>
                    Import
                </Button>
                <Button onClick={clearAll}>
                    clear all
                </Button>
                <Button onClick={() => { toggleSort('createdAt') }}>
                    toggle sort
                </Button>
                <Button onClick={() => { toggleFilter('starredOnly') }}>
                    starred only: {filterState.starredOnly ? "Star" : "-"}
                </Button>
            </Stack>


            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                <List>
                    {missionItems.map((m, i) => (
                        <ListItem key={m.problem.id}>
                            [{i}] {m.problem.id} {m.problem.title} /
                            at {new Date(m.problem.createdAt).toLocaleString()}
                            [{m.problem.starred ? "★" : "☆"}] /
                            {m.learning?.solvedCount}
                            <Button onClick={() => toggleStar(m)}>
                                Toggle Stars
                            </Button>
                            <Button onClick={() => { markAnswer(m, "solved") }}>
                                Answer
                            </Button>
                            <Button onClick={() => { handleDelete(m) }}>
                                Delete
                            </Button>

                        </ListItem>
                    ))}
                </List>
            </Box>
            {inputElement} { /*  input elements */}
        </AppLayout>
    )
}