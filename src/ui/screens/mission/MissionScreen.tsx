import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";

import { AppShell } from "@/ui/common/components/layout/AppShell";
import { routes } from "@/ui/App/useAppNavigation";
import { useMissionModeStore } from "./hooks/useMissionModeStore";
import MissionFabMenu from "./components/MissionFabMenu";
import { useImport } from "@/ui/dialogs/Import/useImport";
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useBackupRestoreDialog } from "@/ui/dialogs/BackupRestoreDialog";
import { MissionList } from "@/ui/screens/mission/components/MissionList";
import FooterNavigation from '@/ui/common/components/FooterNavigation';
import { IconButton } from '@mui/material';

export default function MissionScreen() {
    const navigate = useNavigate()
    const editMode = useMissionModeStore(s=>s.editMode)

    return (
        <AppShell
            header="Missions"
            rightActions={<MissionEditModeControl/>}
            fab={!editMode && <MissionFabMenu onCreateNewMission={()=>navigate(routes.newMission)} />}
            footer={<FooterNavigation/>}
        >

            <MissionList/>           
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
