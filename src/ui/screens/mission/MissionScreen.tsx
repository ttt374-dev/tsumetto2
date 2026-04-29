import { Navigate, useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'

import { AppShell } from "@/ui/common/components/layout/AppShell";
import { routes } from "@/ui/App/useAppNavigation";
import { useMissionModeStore } from "./hooks/useMissionModeStore";
import { MissionList } from "@/ui/screens/mission/components/MissionList";
import FooterNavigation from '@/ui/common/components/FooterNavigation';

function MissionRightAction(){
    const navigate = useNavigate()
    return (<>
        <IconButton sx={{color: "white"}} onClick={()=>navigate(routes.newMission)}>
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
    //const editMode = useMissionModeStore(s=>s.editMode)

    return (
        <AppShell
            header="Missions"
            rightActions={<MissionRightAction/>}
            //rightActions={<MissionEditModeControl/>}
            //fab={!editMode && <MissionFabMenu onCreateNewMission={()=>navigate(routes.newMission)} />}
            footer={<FooterNavigation/>}
        >

            <MissionList/>           
            
            
        </AppShell>
    );
}



