import { Box, Button, IconButton, List, ListItem, Stack } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';

import { useExercise } from "../../application/useExercise"
import { useFileSelector } from "../sharedComponents/useFileSelector"
import { useToast } from "../App/providers/ToastProvider"
import type { Exercise } from "@/domain/Exercise/Exercise"
import { AppLayout } from "../common/AppLayout"
import { createImportProblemsUsecase, type ImportResult } from "@/usecase/importProblemsUseCase"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { useQuery } from "@/application/useQuery"
import { applyQuery } from "@/domain/Exercise/query/applyQuery"
import LibrarySortControl from "./components/LibrarySortControl"
import { useLibraryQueryContext } from "../App/providers/QueryProvider";

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
//////////////////////////////////////////////////
export function LibraryScreen() {
    const { exerciseList, reload,        
        deleteProblem, toggleStar, deleteAllProblems } = useExercise()
    const query = useLibraryQueryContext()

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
        deleteAllProblems()
    }
    const handleDelete = (m: Exercise) => {
        if (!window.confirm("ok to delete ? ")) return
        deleteProblem(m.problem.id).then(() => {
            toast({ message: "deleted" })
        })
    }

    const libraryItems = applyQuery(exerciseList, query.sortState, query.filterState)
    console.log("library items", libraryItems, exerciseList)
    return (
        <AppLayout>
            <Stack direction="row">
                <Button onClick={openFileDialog}>
                    Import
                </Button>
                <Button onClick={handleDeleteAll}>
                    Delete all
                </Button>
                <Button onClick={() => { query.toggleFilter('starredOnly') }}>
                    starred only: {query.filterState.starredOnly ? "Star" : "-"}
                </Button>
                <LibrarySortControl 
                    sort={query.sortState}
                    onSetSortKey={query.toggleSort}
                    onSetSortOrder={(order) => {
                        query.setSortState(prev=>({...prev, order: order}))
                    }}
                />
            </Stack>

            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                <List>
                    {libraryItems.map((m, i) => (
                        <ListItem key={m.problem.id}>
                            [{i}] {m.problem.id.slice(0, 8)} {m.problem.title} -
                            at {new Date(m.problem.createdAt).toLocaleString()} - 
                            {m.learning?.solvedCount} / {m.learning?.totalCount}
                            <Button onClick={() => toggleStar(m)}>
                            [{m.problem.starred ? "★" : "☆"}]
                            </Button>
                            <IconButton onClick={() => { handleDelete(m) }}>
                                <DeleteIcon/>
                            </IconButton>

                        </ListItem>
                    ))}
                </List>
            </Box>
            {inputElement} { /*  input elements */}
        </AppLayout>
    )
}