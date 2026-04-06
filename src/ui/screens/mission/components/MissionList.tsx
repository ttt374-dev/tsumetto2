import { Box, ToggleButton, List, ListItem, ListItemButton, ListItemText, Stack, ToggleButtonGroup, IconButton, keyframes, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type UniqueIdentifier, TouchSensor } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { type MissionExecutionMode } from "@/ui/screens/mission/components/MissionExecutionModeControl";
import { useMissionStarter } from "@/ui/screens/mission/hooks/useMissionStarter";
import { useMissionViewModel } from "@/ui/screens/mission/hooks/useMissionViewModel";
import { SortableMissionItem } from "@/ui/screens/mission/components/SortablMissionItem";

function createSensors(){
    return useSensors(
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
}
export function MissionList(props: {    
    executionMode: MissionExecutionMode
}) {
    const { missionArray, onDragEnd }  = useMissionViewModel();
    const { startMission } = useMissionStarter()

    // dnd-kit センサ    
    const sensors = createSensors()
    
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
                            />
                        ))}
                    </List>
                </SortableContext>
            </DndContext>
        </Box>)
}

/////////////
