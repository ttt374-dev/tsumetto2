import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { Box, Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";

import { useLongPress } from "@/ui/common/hooks/useLongPress";
import { StarToggleButton } from "@/ui/common/components/StarToggleButton/StarToggleButton";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { useStarToggleButton } from '@/ui/common/components/StarToggleButton/useStarToggleButton';
import type { LibraryActionMode } from "@/ui/screens/library/hooks/useLibraryViewModel";
import { toProblemViewData } from "@/ui/features/problem/hooks/problemPresenter";
import type { LearningState } from "@/domain/learning/entity/LearningState";
import { toLearningStateViewData } from "@/ui/features/learning/hooks/learningPresenter";
import type { QueryState, SortKey } from "@/domain/problem/service/query/QueryState";
import { useProblemsQueryStore } from "@/ui/features/problem/hooks/useProblemsQueryStore";
import { SortKeyLabel } from "@/ui/features/problem/query/SortControl";


export const LibraryListItem = function LibraryListItem({ id, onItemClick,
    showCheckbox, isChecked, onToggleChecked, onChangeActionMode,
    selected }: {
        id: ProblemId,
        showCheckbox: boolean,
        onItemClick: (p: Problem) => void,
        isChecked: boolean,
        onToggleChecked: (id: ProblemId) => void,        
        onChangeActionMode: (mode: LibraryActionMode) => void
        selected?: boolean,
        //sortKey?: SortKey
    }) {
    const problem = useProblemStore(s => s.byId[id])
    const learning = useLearningRecordStore(s => s.stateRecords[id])

    const { bind, isLongPressedRef } = useLongPress({
        onLongPress: () => {          
            onChangeActionMode("selection")  
            onToggleChecked(id)
        },

    })
    const starController = useStarToggleButton(id)
    const vdProblem = toProblemViewData(problem)    
    const sortKey = useProblemsQueryStore(s=>s.state.sortKey)

    const getSortKeyText = (sortKey: SortKey) => {
        if (!learning) return ""
        const vdLearning = toLearningStateViewData(learning)
        let text = undefined
        switch (sortKey) {
            case "createdAt":
                text = vdProblem.createdAtText
                break;
            case "score":
                text = vdLearning.scoreText
                break
            case "nextReviewedAt":
                text = vdLearning.nextReviewedInText
                break
            case "easeFactor":
                text = vdLearning.easeFactorText
                break
        }
        const label = text !== undefined ? SortKeyLabel[sortKey] : "出典"
        text = text ? text : vdProblem.sourceText
        return `${label}: ${text}`
    }

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
                            <Typography variant="subtitle1" fontWeight="bold" flex={10}  color="text.primary">
                                {problem.title}
                            </Typography>
                            <Typography variant="body2" flex={2}>
                                { vdProblem.typeText}
                                { vdProblem.plyLengthText}
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
                                    {/*出典：{problem.source}*/}
                                    { getSortKeyText(sortKey)}
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
    learning: LearningState
}) {
    const vm = toLearningStateViewData(props.learning)
    return (
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Box>
                {vm.nextReviewedInText}
            </Box>

            <Box>
                {vm.performaceText}
            </Box>
        </Stack>

    )
}
