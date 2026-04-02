import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { Box, Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";

import { useLongPress } from "@/ui/common/hooks/useLongPress";
import { StarToggleButton } from "@/ui/common/components/StarToggleButton/StarToggleButton";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore";
import { useStarToggleButton } from '@/ui/common/components/StarToggleButton/useStarToggleButton';
import { Learning } from "@/domain/learning/entity/Learning";
import type { LibraryActionMode } from "@/ui/library/hooks/useLibraryViewModel";
import { problemTypeToLabel } from "@/domain/problem/entity/ProblemType";
import { learningPresenter } from "@/ui/learning/learningPresenter";

export const LibraryListItem = function LibraryListItem({ id, onItemClick,
    showCheckbox, isChecked, onToggleChecked, onChangeActionMode,
    selected }: {
        id: ProblemId,
        showCheckbox: boolean,
        onItemClick: (p: Problem) => void,
        isChecked: boolean,
        onToggleChecked: (id: ProblemId) => void,
        selected?: boolean,
        onChangeActionMode: (mode: LibraryActionMode) => void

    }) {
    const problem = useProblemStore(s => s.byId[id])
    const learning = useLearningRecordStore(s => s.records[id])

    const { bind, isLongPressedRef } = useLongPress({
        onLongPress: () => {          
            onChangeActionMode("selection")  
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
                            <Typography variant="subtitle1" fontWeight="bold" flex={8}  color="text.primary">
                                {problem.title}
                            </Typography>
                            <Typography variant="body2" flex={3}>
                                {problemTypeToLabel(problem.type)}
                                {problem.kifData.moves.length}手
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
                    secondary={<>

                            {/* 二行目: 出典*/}
                            <Stack direction="row" justifyContent={"space-between"}>
                                { problem.source &&
                                <Typography variant="body2">
                                    出典：{problem.source}
                                </Typography>}
                                { /* <Typography variant="body2">
                                    {problem.tags.join(",")}
                                </Typography>
                                */ }
                            </Stack>
                            {/* 学習データ */}
                            {learning && 
                                <LearningSection learning={learning} />
                            }
</>

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
export function LearningSection(props: {
    learning: Learning
}) {
    const nextReviewedAt = new Date(props.learning.nextReviewedAt).toLocaleString()
    return (
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Box>
                {nextReviewedAt}
            </Box>

            <Box>
                {learningPresenter.performance.getText(props.learning)}
            </Box>
        </Stack>

    )
}
