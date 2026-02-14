import StarIcon from "@mui/icons-material/Star"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import type { Learning } from "@/domain/learning/Learning";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { Box, Checkbox, colors, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import { useLongPress } from "../hooks/useLongPress";
import { StarToggleButton } from "@/ui/common/components/StarToggleButton";
import { useStarToggleButton } from "@/application/useStarToggleButton";
import React, { useEffect } from "react";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useStores } from "@/application/store/useStores";
import { useLearningRecordStore } from "@/application/useLearningRecord";

export const LibraryListItem = React.memo(function LibraryListItem({ id, onItemClick,
    showCheckbox, onToggleCheckboxMode, isChecked, onToggleChecked,
    selected }: {
        //problem: Problem,
        id: ProblemId,
        //learning?: Learning,
        showCheckbox: boolean,
        onItemClick: (p: Problem) => void,
        isChecked: boolean,
        onToggleChecked: (id: ProblemId) => void,
        onToggleCheckboxMode: () => void,
        selected?: boolean,

    }) {
    const problem = useProblemStore(s => s.byId[id])
    
    const eventLog = useStores().learningEvent.eventLog
    const setRecords = useLearningRecordStore.getState().setFromEventLog
    // eventLog 更新時に projection 更新
    useEffect(() => {
        setRecords(eventLog)
    }, [eventLog, setRecords])
    const learning = useLearningRecordStore(s=>s.records[id])


    const { bind, isLongPressedRef } = useLongPress({
        onLongPress: () => {
            onToggleCheckboxMode()
            onToggleChecked(id)
        },

    })
    //console.log("render:", problem.id)
    const starController = useStarToggleButton(problem)

    return (
        <ListItem>
            <ListItemButton
                disableRipple
                onClick={() => {
                    if (isLongPressedRef.current) return
                    onItemClick(problem)}}
                selected={selected}
                {...bind}
                sx={{ borderBottom: 1, borderColor: "divider" }}>
                {showCheckbox &&
                    <ListItemIcon>
                        <Checkbox disableRipple onClick={(e) => e.stopPropagation()}
                        size="small" edge="start" checked={isChecked}
                        onChange={() => onToggleChecked(id)} />
                    </ListItemIcon>
                }
                <ListItemText >
                    {/* 一行目: タイトル */}
                    <Stack direction="row" justifyContent={"space-between"} alignItems="center">
                        <Typography variant="subtitle1" fontWeight="bold" flex={7}>
                            {problem.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" flex={1}>
                            {problem.kifData.moves.length}手詰め
                        </Typography>
                        <Box flex={1}>
                            <StarToggleButton starred={starController.starred}
                                onToggle={starController.toggleStar} />
                        </Box>
                    </Stack>

                    {/* 二行目: タグ・追加日・学習結果 */}
                    <Stack direction="row" justifyContent={"space-between"}>
                        <Typography variant="body2" color="text.secondary">
                            {problem.tags.join(",")}
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
        </ListItem>
    )
})

const DAY_MS = 60 * 60 * 24 * 1000
export function inDays(date: number, now: number = Date.now()): number {
    //return (date - now) / (60 * 60 * 24 * 1000)
    return Math.ceil((date - now) / DAY_MS)    
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
