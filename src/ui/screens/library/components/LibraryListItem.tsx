import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { Box, Checkbox, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";

import { useLongPress } from "@/ui/common/hooks/useLongPress";
import { StarToggleButton } from "@/ui/common/components/StarToggleButton/StarToggleButton";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { useStarToggleButton } from '@/ui/common/components/StarToggleButton/useStarToggleButton';
import type { LibrarySelection } from "@/ui/screens/library/hooks/useLibrarySelection";
import { toProblemViewData } from "@/ui/features/problem/hooks/problemPresenter";
import type { LearningState } from "@/domain/learning/entity/LearningState";
import { toLearningStateViewData } from "@/ui/features/learning/hooks/learningPresenter";
import type { SortKey } from "@/domain/problem/service/query/QueryState";
import { useProblemsQueryStore } from "@/ui/features/problem/hooks/useProblemsQueryStore";
import { SortKeyLabel } from "@/ui/features/problem/query/SortControl";

export const LibraryListItem = function LibraryListItem({ id, onItemClick,
    selection, selected }: {
        id: ProblemId,
        selection?: LibrarySelection,
        onItemClick: (id: ProblemId) => void,
        selected?: boolean,
    }) {
    const problem = useProblemStore(s => s.byId[id])
    const learning = useLearningRecordStore(s => s.stateRecords[id])

    const { bind, isLongPressedRef } = useLongPress({
        onLongPress: () => {          
            selection?.startSelection()
            selection?.toggleChecked(id)
        },
    })
    const starController = useStarToggleButton(id)
    const vdProblem = toProblemViewData(problem)    
    const sortKey = useProblemsQueryStore(s=>s.state.sortKey)
    const getSortKeyText = (sortKey: SortKey) => {
        const vdLearning = learning && toLearningStateViewData(learning)
        let text = undefined
        switch (sortKey) {
            case "createdAt":
                text = vdProblem.createdAt
                break;
            case "score":
                text = vdLearning?.score
                break
            case "nextReviewedAt":
                text = vdLearning?.nextReviewedIn
                break
            case "easeFactor":
                text = vdLearning?.easeFactor
                break
        }
        return text ? `${SortKeyLabel[sortKey]}: ${text}` : ""        
    }

    //////////////////////////////////////////////////////////
    return (
        <ListItem disablePadding>
            <ListItemButton
                disableRipple
                onClick={() => {
                    if (isLongPressedRef.current) return
                    onItemClick(problem.id)
                }}
                selected={selected}
                {...bind}
                sx={{ borderBottom: 1, borderColor: "divider", px: 1, py: 0 }}>
                {selection?.isSelecting &&
                    <ListItemIcon>
                        <Checkbox disableRipple onClick={(e) => e.stopPropagation()}
                            size="small" edge="start" checked={selection.isChecked(id)}
                            onChange={() => selection.toggleChecked(id)} />
                    </ListItemIcon>
                }
                <ListItemText
                    primary={
                        <Stack direction="row" justifyContent={"space-between"} alignItems="center">
                            <Typography variant="subtitle1" fontWeight="bold" flex={10}  color="text.primary">
                                {problem.title}
                            </Typography>
                            <Typography variant="body2" flex={2}>
                                { vdProblem.type}
                                { vdProblem.plyLength}
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
                                <Typography variant="body2">
                                    { getSortKeyText(sortKey)}
                                </Typography>
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
    return Math.ceil((date - now) / DAY_MS)
}
export function LearningSection(props: {
    learning: LearningState
}) {
    const vd = toLearningStateViewData(props.learning)
    return (
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Box>
                {vd.masteryStatus}
            </Box>
            <Box>
                {vd.nextReviewedIn}
            </Box>
            <Box>
                {vd.performace}
            </Box>
        </Stack>
    )
}
