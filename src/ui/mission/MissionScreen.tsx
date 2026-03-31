import { useRef, useState } from "react";
import { Box, ToggleButton, List, ListItem, ListItemButton, ListItemText, Stack, ToggleButtonGroup, IconButton, keyframes, Checkbox, FormControlLabel, TextField } from "@mui/material";
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
import { useLongPress } from "@/ui/library/hooks/useLongPress";
import { DefaultMissionExecutionMode, ExecutionModeControl, type MissionExecutionMode } from "@/ui/mission/components/MissionExecutionModeControl";
import type { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { useImport } from "@/ui/Import/useImport";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useBackupRestoreDialog } from "@/ui/common/components/dialogs/BackupRestoreDialog";
import { useMissionStarter } from "@/ui/mission/hooks/useMissionStarter";
import { useMissionCreator } from "@/ui/mission/hooks/useMissionCreator";
import { MissionList } from "@/ui/mission/components/MissionList";

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
