import type { Exercise } from "@/domain/Exercise/Exercise";
import { ListItem } from "@mui/material";

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