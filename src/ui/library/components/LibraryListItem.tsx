import VisibilityIcon from '@mui/icons-material/Visibility';

import type { Learning } from "@/domain/learning/Learning";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { Box, Checkbox, colors, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import { useLongPress } from "../hooks/useLongPress";
import { StarToggleButton } from "@/ui/common/components/StarToggleButton";
import { useStarToggleButton } from "@/application/useStarToggleButton";
import React, { useEffect } from "react";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useLearningRecordStore } from "@/application/useLearningRecordStore";
import { useNavigate } from 'react-router-dom';
import { routes } from '@/ui/App/useAppNavigation';

export const LibraryListItem = function LibraryListItem({ id, onItemClick,
    showCheckbox, isChecked, onToggleChecked,
    selected }: {
        id: ProblemId,
        showCheckbox: boolean,
        onItemClick: (p: Problem) => void,
        isChecked: boolean,
        onToggleChecked: (id: ProblemId) => void,
        selected?: boolean,

    }) {
    const problem = useProblemStore(s => s.byId[id])
    const learning = useLearningRecordStore(s => s.records[id])

    const { bind, isLongPressedRef } = useLongPress({
        onLongPress: () => {            
            onToggleChecked(id)
        },

    })
    const starController = useStarToggleButton(id)

    //////////////////////////////////////////////////////////
    return (
        <ListItem disablePadding>
            <ListItemButton
                disableRipple
                onClick={() => {
                    if (isLongPressedRef.current) return
                    onItemClick(problem)
                }}
                selected={selected}
                {...bind}
                sx={{ borderBottom: 1, borderColor: "divider", px: 1, py: 0 }}>
                {showCheckbox &&
                    <ListItemIcon>
                        <Checkbox disableRipple onClick={(e) => e.stopPropagation()}
                            size="small" edge="start" checked={isChecked}
                            onChange={() => onToggleChecked(id)} />
                    </ListItemIcon>
                }
                <ListItemText
                    primary={
                        <Stack direction="row" justifyContent={"space-between"} alignItems="center">
                            <Typography variant="subtitle1" fontWeight="bold" flex={4}

                            >
                                {problem.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" flex={1}>
                                {problem.kifData.moves.length}手詰め
                            </Typography>
                            <Stack direction="row" flex={1}>
                                <StarToggleButton starred={starController.starred}
                                    onToggle={starController.toggleStar} />

                            </Stack>
                        </Stack>
                    }
                    slotProps={{
                        secondary: {
                            component: "div",
                        },
                    }}
                    secondary={
                        <>
                            {/* 二行目: タグ・追加日 */}
                            <Stack direction="row" justifyContent={"space-between"}>
                                <Typography variant="body2" color="text.secondary">
                                    {problem.tags.join(",")}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {new Date(problem.createdAt).toLocaleString()}
                                </Typography>
                            </Stack>
                            {/* 三行目: タグ・追加日 */}
                            <Stack direction="row" justifyContent={"flex-end"}>
                                {learning && <>
                                    <Typography variant="body2" color="text.primary">
                                        {formatLearning(learning)}
                                    </Typography>
                                </>}
                            </Stack></>
                    }

                >

                </ListItemText>
            </ListItemButton>
        </ListItem>
    )
}
const DAY_MS = 60 * 60 * 24 * 1000
export function inDays(date: number, now: number = Date.now()): number {
    //return (date - now) / (60 * 60 * 24 * 1000)
    return Math.ceil((date - now) / DAY_MS)
}
export function formatLearning(learning: Learning): string {
    const indays = inDays(learning.nextReviewedAt)
    const indaysString = indays >= 0 ? `${indays.toFixed(0)}d` : "due"
    //const indaysString = new Date(learning.nextReviewedAt).toLocaleString()
    const accuracyString = `${(learning.accuracy * 100).toFixed(0)}%`

    return `${accuracyString}(${learning.solvedCount}:${learning.failedCount})`
    return `${learning.solvedCount}:${learning.failedCount}=${(learning.accuracy * 100).toFixed(0)}%,
ef${learning.easeFactor.toFixed(2)},
${indaysString}
`
}
