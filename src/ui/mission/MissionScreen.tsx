import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { DashboardScreen } from "../dashboard/DashboardScreen";
import { PlayerScreen } from "../player/PlayerScreen";
import { SummaryScreen } from "../summary/SummaryScreen";

export function MissionScreen() {   
    const missionStore = useMissionEventStoreContext()    
    const phase = missionStore.snapshot?.phase ?? "idle"

    switch (phase) {
        case "idle":
            return (<DashboardScreen/>
            )
        case "playing":
            return (
                <PlayerScreen/>
            )
        case "finished":
            return (
                <SummaryScreen/>
            )
    }
}