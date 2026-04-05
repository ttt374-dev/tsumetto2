import { useRef, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add'

import { AppShell } from "../common/components/layout/AppShell";
import { useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";
import { useMissionModeStore } from "./hooks/useMissionModeStore";
import MissionFabMenu from "./components/MissionFabMenu";
import { DefaultMissionExecutionMode, ExecutionModeControl, type MissionExecutionMode } from "@/ui/mission/components/MissionExecutionModeControl";
import { useImport } from "@/ui/dialogs/Import/useImport";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useBackupRestoreDialog } from "@/ui/dialogs/BackupRestoreDialog";
import { MissionList } from "@/ui/mission/components/MissionList";
import { IconButton } from "@mui/material";

export default function MissionScreen() {
    const [ executionMode, setExecutionMode] = useState<MissionExecutionMode>(DefaultMissionExecutionMode)   
    const navigate = useNavigate()

    return (
        <AppShell
            header="Missions"
            rightActions={
                <>
                <IconButton onClick={()=>navigate(routes.newMission)} sx={{color: "white"}}>
                    <AddIcon/>
                </IconButton>
                <MissionEditModeControl/>
                </>
            }
            fab={<MissionFabMenu onCreateNewMission={()=>navigate(routes.newMission)} />}
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
