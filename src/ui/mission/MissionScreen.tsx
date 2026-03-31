import { useRef, useState } from "react";
import { Box, ToggleButton, List, ListItem, ListItemButton, ListItemText, Stack, ToggleButtonGroup, IconButton, keyframes, Checkbox, FormControlLabel, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type UniqueIdentifier, TouchSensor } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { AppShell } from "../common/components/layout/AppShell";
import {  useMissionStats, useMissionViewModel } from "./hooks/useMissionViewModel";
import { useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";
import type { Mission, MissionId } from "@/domain/mission/entity/Mission";
import { useMissionModeStore } from "./hooks/useMissionModeStore";
import MissionFabMenu from "./components/MissionFabMenu";
import { useLongPress } from "@/ui/library/hooks/useLongPress";
import { DefaultMissionExecutionMode, ExecutionModeControl, type MissionExecutionMode } from "@/ui/mission/components/MissionExecutionModeControl";
import type { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { useImport } from "@/ui/Import/useImport";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useBackupRestoreDialog } from "@/ui/common/components/dialogs/BackupRestoreDialog";
import { useMissionStarter } from "@/ui/mission/hooks/useMissionStarter";
import { useMissionCreator } from "@/ui/mission/hooks/useMissionCreator";

export default function MissionScreen() {
    const { createMission } = useMissionCreator()    
    const [ executionMode, setExecutionMode] = useState<MissionExecutionMode>(DefaultMissionExecutionMode)   

    return (
        <AppShell
            header="Missions"
            rightActions={
                <MissionEditModeControl/>
            }
            fab={<MissionFabMenu onCreateNewMission={createMission} />}
        >
            <ExecutionModeControl 
                value={executionMode} 
                onChange={m=>setExecutionMode(m)}/>
            
            <MissionList                
                executionMode={executionMode}
            />           
            <MissionRelatedDialogs/>
            
        </AppShell>
    );
}
///////////////////////////
function MissionEditModeControl(){
    const { editMode, toggleEditMode } = useMissionModeStore()
    return (
        <IconButton onClick={toggleEditMode} sx={{ color: !editMode ? "white" : "default" }}>
            <EditIcon />
        </IconButton>
    )
}
function MissionRelatedDialogs(){
    const reloadProblems = useProblemStore(s => s.reload);
    const toast = useToast()

    const importer = useImport(async (res) => {
        await reloadProblems();
        toast({
            message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}`,
        });
    });
    const backupRestoreDialog = useBackupRestoreDialog();

    return (
        <>
            {/* ダイアログ */}
            {importer.filesSelectElement}
            {importer.dialogElement}
            {backupRestoreDialog.dialogElement}
        </>
    )
}
///////////////////
function MissionList(props: {
    
    executionMode: MissionExecutionMode
}) {
    const { missionArray, onDragEnd }  = useMissionViewModel();
    const { startMission } = useMissionStarter()
    const { missionStats } = useMissionStats(missionArray)

    // dnd-kit センサ    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: 5,
            },
        })
    );
    
    return (
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}> { /* , touchAction: "pan-y" */}
            <DndContext sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={() => console.log("drag start")}
                onDragEnd={e => onDragEnd(e.active.id, e.over?.id ?? null)}>
                <SortableContext items={missionArray.map(d => d.id)} strategy={verticalListSortingStrategy}>
                    <List>
                        {missionArray.map(mission => (
                            <SortableMissionItem
                                key={mission.id}
                                mission={mission}
                                
                                startMission={() => startMission(mission, props.executionMode)}
                                missionStats={missionStats.get(mission.id)}
                            />
                        ))}
                    </List>
                </SortableContext>
            </DndContext>
        </Box>)
}

/////////////
function SortableMissionItem(props: {
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
