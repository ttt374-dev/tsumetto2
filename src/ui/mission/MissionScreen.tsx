import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { DashboardScreen } from "../dashboard/DashboardScreen";
import { PlayerScreen } from "../player/PlayerScreen";
import { SummaryScreen } from "../summary/SummaryScreen";
import { useMissionController } from "./hooks/useMissionController";

export function MissionScreen() {   
    const mission = useMissionController()
    const missionStore = useMissionEventStoreContext()
    
    const phase = missionStore.snapshot?.phase ?? "idle"
    console.log("phase", phase)

    switch (phase) {
        case "idle":
            return (<DashboardScreen/>
            )
        case "playing":        
            //if (!mission.currentProblemId) return null
            //const title = `${mission.index+1}/${mission.snapshot?.problemIds.length}: ${mission.currentProblem.title}`
            // TODO: title prefix            
            return (
                <PlayerScreen/>
            )
        case "finished":
            return (
                <SummaryScreen/>
            )
    }
}