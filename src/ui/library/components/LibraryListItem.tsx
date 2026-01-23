import type { Exercise } from "@/domain/Exercise/Exercise";
import type { Learning } from "@/domain/learning/Learning";
import { Box, Checkbox, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";

export function LibraryListItem({ exercise, onClick, isCheckboxMode, isChecked, onToggleChecked }: {
    exercise: Exercise,
    isCheckboxMode: boolean,
    onClick?: () => void,
    isChecked: boolean,
    onToggleChecked: () => void,
}) {
    return (
        <ListItem key={exercise.problem.id}   sx={{ borderBottom: 1, borderColor: "divider" }}>     
            { isCheckboxMode &&
            <ListItemIcon>
                <Checkbox size="small" edge="start" checked={isChecked} onChange={onToggleChecked}/>
            </ListItemIcon>       
            }
            
            <ListItemText  onClick={onClick}>
                {/* 一行目: タイトル */}
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {exercise.problem.title}
                    </Typography>
                </Box>

                {/* 二行目: 追加日・学習結果 */}
                <Stack direction="row" justifyContent={"space-between"}>
                    <Typography variant="body2" color="text.secondary">
                        {new Date(exercise.problem.createdAt).toLocaleString()}
                    </Typography>

                    {exercise.learning && <>
                        <Typography variant="body2" color="text.primary">
                            {formatLearning(exercise.learning)}
                        </Typography>

                    </>}
                </Stack>

            </ListItemText>
        </ListItem>
    )
}

function inDays(date: number): number {
    return (date - Date.now()) / (60 * 60 * 24 * 1000)
}
function formatLearning(learning: Learning): string {
    return `${learning.solvedCount}:${learning.failedCount},
${(learning.accuracy * 100).toFixed(0)}%,
ef:${learning.easeFactor.toFixed(2)},
${inDays(learning.nextReviewedAt).toFixed(0)}d`
}