import { Box, Button, IconButton, List, ListItem, Stack } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';

import type { Exercise } from "@/domain/Exercise/Exercise"
import { createImportProblemsUsecase, type ImportResult } from "@/usecase/importProblemsUseCase"
import { useRepositoryContext } from "../App/providers/RepositoryProvider"
import { applyQuery } from "@/domain/Exercise/query/applyQuery"
import LibrarySortControl from "./components/LibrarySortControl"
import { useLibraryQueryContext } from "../App/providers/QueryProvider";
import { useExercise } from "@/application/useExercise";
import { useFileSelector } from "../sharedComponents/useFileSelector";
import { useToast } from "../App/providers/ToastProvider";
import { AppLayout } from "../common/AppLayout";
import { useNavigate } from "react-router-dom";

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

export function LibraryListItem({exercise, index, onClick}: {
    exercise: Exercise,
    index: number,    
    onClick?: () => void,
}){
    return (
        <ListItem key={exercise.problem.id} onClick={onClick}>  
            [{index + 1}] {exercise.problem.title} -
            at {new Date(exercise.problem.createdAt).toLocaleString()}
            {exercise.learning && <>
                {exercise.learning.solvedCount} / {exercise.learning.totalCount}
                [ {new Date(exercise.learning.nextReviewedAt).toLocaleDateString()}]
          </>}

        </ListItem>
    )
}
//////////////////////////////////////////////////
export function LibraryScreen() {
    const { exerciseList, reload,        
        deleteProblem, toggleStar, deleteAllProblems } = useExercise()
    const query = useLibraryQueryContext()

    const { openFileDialog, inputElement, setOnFilesSelected } = useFileSelector(".kif")
    const toast = useToast()
    const { importFiles } = useLibrary()
    const navigate = useNavigate()

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
    return (
        <AppLayout>
            <Stack direction="row">
                <Button onClick={openFileDialog}>
                    Import
                </Button>
                <Button onClick={handleDeleteAll}>
                    Delete all
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
                        <LibraryListItem exercise={m} index={i+1}
                            onClick={() => { navigate(`/view/${m.problem.id}`)}}
                        />
                    ))}
                </List>
            </Box>
            {inputElement} { /*  input elements */}
        </AppLayout>
    )
}