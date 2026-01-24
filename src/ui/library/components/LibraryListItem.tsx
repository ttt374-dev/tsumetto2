import type { Learning } from "@/domain/learning/Learning";
import type { Problem } from "@/domain/problem/Problem";
import { Box, Checkbox, ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";

export function LibraryListItem({ problem, learning, onClick, isCheckboxMode, isChecked, onToggleChecked }: {
    problem: Problem,
    learning?: Learning,
    isCheckboxMode: boolean,
    onClick?: () => void,
    isChecked: boolean,
    onToggleChecked: () => void,
}) {
    return (
        <ListItem key={problem.id}   sx={{ borderBottom: 1, borderColor: "divider" }}>     
            { isCheckboxMode &&
            <ListItemIcon>
                <Checkbox size="small" edge="start" checked={isChecked} onChange={onToggleChecked}/>
            </ListItemIcon>       
            }
            
            <ListItemText  onClick={onClick}>
                {/* 一行目: タイトル */}
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {problem.title}
                    </Typography>
                </Box>

                {/* 二行目: 追加日・学習結果 */}
                <Stack direction="row" justifyContent={"space-between"}>
                    <Typography variant="body2" color="text.secondary">
                        {new Date(problem.createdAt).toLocaleString()}
                    </Typography>

                    {learning && <>
                        <Typography variant="body2" color="text.primary">
                            {formatLearning(learning)}
                        </Typography>

                    </>}
                </Stack>

            </ListItemText>
        </ListItem>
    )
}

function inDays(date: number, now: number = Date.now()): number {
    return (date - now) / (60 * 60 * 24 * 1000)
}
function formatLearning(learning: Learning): string {
    const indays = inDays(learning.nextReviewedAt)
    const indaysString = indays >= 0 ? `${indays}d` : "due"
    //const indaysString = new Date(learning.nextReviewedAt).toLocaleString()
    
    return `${learning.solvedCount}:${learning.failedCount},
${(learning.accuracy * 100).toFixed(0)}%,
ef:${learning.easeFactor.toFixed(2)},
${indaysString}
`
}
