import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import type { Learning } from "@/domain/learning/Learning";
import type { Problem } from "@/domain/problem/Problem";
import { Box, Checkbox, colors, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import { useLongPress } from "../hooks/useLongPress";

export function LibraryListItem({ problem, learning, onClick, 
    isCheckboxMode, onToggleCheckboxMode, isChecked, onToggleChecked, onToggleStar,
    selected}: {
    problem: Problem,
    learning?: Learning,
    isCheckboxMode: boolean,
    onClick?: () => void,
    isChecked: boolean,
    onToggleChecked: () => void,
    onToggleCheckboxMode: () => void,
    onToggleStar: () => void,
    selected?: boolean,
    
}) {
    const { bind, isLongPressedRef } = useLongPress({
        onLongPress: () => {
            onToggleCheckboxMode()
            onToggleChecked()
        },

    })
    return (
        <ListItemButton 
            key={problem.id}
            selected={selected}
            {...bind}
            sx={{ borderBottom: 1, borderColor: "divider" }}>     
            {isCheckboxMode &&
                <ListItemIcon>
                    <Checkbox size="small" edge="start" checked={isChecked} onChange={onToggleChecked} />
                </ListItemIcon>
            }
            <ListItemText  onClick={onClick}>
                {/* 一行目: タイトル */}
                <Stack direction="row" justifyContent={"space-between"}  alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold" flex={7}>
                        {problem.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" flex={1}>
                        {problem.kifData.moves.length}手詰め
                    </Typography>
                    <Box flex={1}>
                        <IconButton onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            onToggleStar()
                        }}>
                            {problem.starred ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                    </Box>
                </Stack>

                {/* 二行目: タグ・追加日・学習結果 */}
                <Stack direction="row" justifyContent={"space-between"}>
                    <Typography variant="body2" color="text.secondary">
                        { problem.tags.join(",")}
                    </Typography>
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
        </ListItemButton>
    )
}

export function inDays(date: number, now: number = Date.now()): number {
    return (date - now) / (60 * 60 * 24 * 1000)
}
export function formatLearning(learning: Learning): string {
    const indays = inDays(learning.nextReviewedAt)
    const indaysString = indays >= 0 ? `${indays.toFixed(0)}d` : "due"
    //const indaysString = new Date(learning.nextReviewedAt).toLocaleString()
    
    return `${learning.solvedCount}:${learning.failedCount}=${(learning.accuracy * 100).toFixed(0)}%,
ef${learning.easeFactor.toFixed(2)},
${indaysString}
`
}
