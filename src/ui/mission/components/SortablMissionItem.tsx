import { Box, ToggleButton, List, ListItem, ListItemButton, ListItemText, Stack, ToggleButtonGroup, IconButton, keyframes, Checkbox, FormControlLabel, TextField } from "@mui/material";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useNavigate } from "react-router-dom";
import type { Mission } from "@/domain/mission/entity/Mission";
import { useLongPress } from "@/ui/library/hooks/useLongPress";
import type { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { useMissionModeStore } from "@/ui/mission/hooks/useMissionModeStore";
import { routes } from "@/ui/App/useAppNavigation";

export function SortableMissionItem(props: {
    mission: Mission     
    startMission: () => void
    missionStats: ProblemStats | undefined //    Map<string, ProblemStats>
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

    //const stats = props.missionStats.get(props.mission.id);
    const stats = props.missionStats

    const onItemClick = () => {
        if (isLongPressedRef.current) return
        if (!editMode) {
            props.startMission()
        } else navigate(routes.missionEdit(props.mission.id))
    }
    const disabled = !editMode && (stats?.problemCount === 0)
    
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
                //animation: reorderable ? `${shake} 0.2s infinite` : "none",
                //backgroundColor: isReorder ? "action.hover" : "inherit",
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
                sx={{
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
                            bgcolor: "primary.main",
                        }
                        : {}
                }}

            >
                <ListItemText
                    primary={props.mission.name}
                    secondary={stats && formatStats(stats)}
                />
            </ListItemButton>

        </ListItem>
    );
}
// helpers
const formatStats = (stats: ProblemStats) => {
    return `問題数：${stats.problemCount ?? 0}, スコア：${((stats.score)).toFixed(1)}`
}
