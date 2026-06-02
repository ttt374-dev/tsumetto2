import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'

import { AppShell } from "@/ui/common/components/layout/AppShell";
import { routePaths } from "@/router/paths";
import { useMissionModeStore } from "./hooks/useMissionModeStore";
import { MissionList } from "@/ui/screens/mission/components/MissionList";
import FooterNavigation from '@/ui/common/components/FooterNavigation';

function MissionRightAction(){
    const navigate = useNavigate()
    return (<>
        <IconButton sx={{color: "white"}} onClick={()=>navigate(routePaths.newMission)}>
            <AddIcon/>
        </IconButton>
        <MissionEditModeControl/>
    </>)
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
///////////////////
export default function MissionScreen() {
    return (
        <AppShell
            header="Missions"
            rightActions={<MissionRightAction/>}
            //rightActions={<MissionEditModeControl/>}
            //fab={!editMode && <MissionFabMenu onCreateNewMission={()=>navigate(routes.newMission)} />}
            showBottomNav={true}
        >
            <MissionList/>
        </AppShell>
    );
}



