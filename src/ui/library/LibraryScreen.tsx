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
import { useQuery } from "@/application/useQuery"
import { applyQuery } from "@/domain/missionItem/query/applyQuery"
import LibrarySortControl from "./components/LibrarySortControl"
import type { SortKey } from "@/domain/missionItem/query/sort"

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
    const { missionItems, reload,        
        addProblems, deleteProblem,        
        toggleStar, markAnswer, clearAll } = useMissionItem()
    const { sortState, setSortState, filterState, setFilterState,
        toggleSort, toggleFilter, }  = useQuery()

    const { openFileDialog, inputElement, setOnFilesSelected } = useFileSelector(".kif")
    const toast = useToast()

    const { importFiles } = useLibrary()

    setOnFilesSelected( (filelist) => {
        const files = Array.from(filelist)
        importFiles(files).then((r)=> {
            console.log("imported", r)
            reload()
            toast({message: `import files`})
        })
        
    })
    const handleDeleteAll = () => {
        if (!window.confirm("ok to delete all ?")) return
        clearAll()
    }
    const handleDelete = (m: MissionItem) => {
        if (!window.confirm("ok to delete ? ")) return
        deleteProblem(m.problem.id).then(() => {
            toast({ message: "deleted" })
        })
    }

    const libraryItems = applyQuery(missionItems, sortState, filterState)
    return (
        <AppLayout>
            <Stack direction="row">
                <Button onClick={openFileDialog}>
                    Import
                </Button>
                <Button onClick={handleDeleteAll}>
                    Delete all
                </Button>
                <Button onClick={() => { toggleFilter('starredOnly') }}>
                    starred only: {filterState.starredOnly ? "Star" : "-"}
                </Button>
                <LibrarySortControl 
                    sort={sortState}
                    onSetSortKey={(key) => { toggleSort(key)}}
                    onSetSortOrder={(order) => {
                        setSortState(prev=>({...prev, order: order}))
                    }}
                />
            </Stack>


            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                <List>
                    {libraryItems.map((m, i) => (
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