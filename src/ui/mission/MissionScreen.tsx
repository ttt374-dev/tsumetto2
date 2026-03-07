import { useState } from "react";
import { Box, ToggleButton, List, ListItem, ListItemButton, ListItemText, Stack, ToggleButtonGroup, IconButton, keyframes } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type UniqueIdentifier, TouchSensor } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { AppShell } from "../common/components/layout/AppShell";
import { useMissionViewModel } from "./hooks/useMissionViewModel";
import { useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";
import type { Mission, MissionId } from "@/domain/mission/entity/Mission";
import { useMissionModeStore } from "./hooks/useMissionModeStore";
import MissionFabMenu from "./components/MissionFabMenu";

export default function MissionScreen() {
    const { missionArray, onDragEnd, missionStats, onCreateMission, onStartSession, presenter: { importer, backupRestoreDialog } } =
        useMissionViewModel();
    const navigate = useNavigate();
    const { editMode, toggleEditMode } = useMissionModeStore()

    // dnd-kit センサー
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

    function SortableMissionItem({ mission }: { mission: Mission }) {
        const sortable = useSortable({ id: mission.id });

        const style = {
            transform: CSS.Transform.toString(sortable.transform),
            transition: sortable.transition,
            touchAction: "none"
        };

        const stats = missionStats.get(mission.id);      

        return (
            <ListItem
                ref={sortable.setNodeRef}
                style={ editMode ? style: undefined}
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
                    <>
                        { editMode &&
                        <>
                        
                        <IconButton
                            {...sortable.attributes}
                            {...sortable.listeners}
                        >
                            <DragIndicatorIcon />
                        </IconButton>
                        </>
                        }
                    </>
                }
            >

                {/* 通常動作はモード依存 */}
                <ListItemButton
                    onClick={() => {
                        if (!editMode) onStartSession(mission)
                        else navigate(routes.missionEdit(mission.id))                        
                    }}
                    disabled={!editMode && (stats?.problemCount === 0)} 
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
                        primary={mission.name}
                        secondary={`問題数：${stats?.problemCount ?? 0}, 正答率：${((stats?.accuracy ?? 0) * 100).toFixed(0)}%`}
                    />
                </ListItemButton>

            </ListItem>
        );
    }
    function ActionMode(){
        return (
               <Stack direction="row" justifyContent="flex-end">
                <ToggleButton value={editMode} selected={editMode} onChange={toggleEditMode}>
                    <EditIcon />
                </ToggleButton>
            </Stack>
        )

    }
    return (
        <AppShell
            header="Missions"
            rightActions={
                <IconButton onClick={toggleEditMode} sx={{color: !editMode ? "white" : "default"}}>
                    <EditIcon  />
                </IconButton>
            }
            fab={<MissionFabMenu onCreateNewMission={onCreateMission} />}

        >
            <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}> { /* , touchAction: "pan-y" */ }
                <DndContext sensors={sensors} 
                    collisionDetection={closestCenter}
                    onDragStart={()=>console.log("drag start")}
                    onDragEnd={e => onDragEnd(e.active.id, e.over?.id ?? null)}>
                    <SortableContext items={missionArray.map(d => d.id)} strategy={verticalListSortingStrategy}>
                        <List>
                            {missionArray.map(mission => (
                                <SortableMissionItem key={mission.id} mission={mission} />
                            ))}
                        </List>
                    </SortableContext>
                </DndContext>
            </Box>

            {/* ダイアログ */}
            {importer.filesSelectElement}
            {importer.dialogElement}
            {backupRestoreDialog.dialogElement}
        </AppShell>
    );
}