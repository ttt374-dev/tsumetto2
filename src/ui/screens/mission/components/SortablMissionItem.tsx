import { ListItem, ListItemButton, ListItemText, IconButton,  } from "@mui/material";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useNavigate } from "react-router-dom";
import type { Mission } from "@/domain/mission/entity/Mission";
import { useLongPress } from "@/ui/common/hooks/useLongPress";
import { useMissionModeStore } from "@/ui/screens/mission/hooks/useMissionModeStore";
import { routes } from "@/ui/App/useAppNavigation";
import { computeStatsSummary } from "@/domain/learning/service/computeLearningSummary";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { applyQuery } from "@/domain/problem/service/query/applyQuery";
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import type { StatsSummary } from "@/domain/learning/entity/StatsSummary";

export function SortableMissionItem(props: {
    mission: Mission     
    startMission: () => void
}) {
    const {editMode, toggleEditMode } = useMissionModeStore()    

    const { bind, isLongPressedRef } = useLongPress({
        onLongPress: () => {
            toggleEditMode()
        },

    })
    const sortable = useSortable({ id: props.mission.id });
    const navigate = useNavigate();
    const style = {
        transform: CSS.Transform.toString(sortable.transform),
        transition: sortable.transition,
        touchAction: "none"
    };
    const activeIds = useProblemStore(s=>s.activeProblems)    
    const learningRecords = useLearningRecordStore(s=>s.stateRecords)
    const ids = applyQuery(activeIds, learningRecords, props.mission.queryState).map(p=>p.id)
    const summary = computeStatsSummary(ids, learningRecords)
    

    const onItemClick = () => {
        if (isLongPressedRef.current) return
        if (!editMode) {
            props.startMission()
        } else navigate(routes.missionEdit(props.mission.id))
    }
    const disabled = !editMode && (summary.problemCount === 0)
    
    ////////////////
    return (
        <ListItem
            ref={sortable.setNodeRef}
            style={editMode ? style : undefined}
            disablePadding
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                //px: 2,
                display: 'flex',
                alignItems: 'center',
            }}
            secondaryAction={
                editMode &&
                <IconButton
                    {...sortable.attributes}
                    {...sortable.listeners}
                >
                    <DragIndicatorIcon />
                </IconButton>
            }
        >

            {/* 通常動作はモード依存 */}
            <ListItemButton
                onClick={onItemClick}
                {...bind}
                disabled={disabled}
                sx={theme => ({
                    bgcolor: editMode ? "action.hover" : "transparent",
                    position: "relative",
                    "&::before": editMode
                        ? {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 4,
                            bgcolor: theme.palette.primary.main,
                        }
                        : {}
                })}

            >
                <ListItemText
                    primary={props.mission.name}
                    secondary={formatSummary(summary)}
                />
            </ListItemButton>

        </ListItem>
    );
}
// helpers
const formatSummary = (summary: StatsSummary) => {
    const ratio = summary.problemCount === 0 ? 0 : (1 - summary.overdueCount / summary.problemCount) * 100
    return `問題数：${summary.problemCount ?? 0}, スコア：${((summary.avgScore)).toFixed(1)}, 達成率：${ratio.toFixed(0)}%`
}