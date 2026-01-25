import { DashboardScreen } from "../dashboard/DashboardScreen";
import { PlayerScreen } from "../player/PlayerScreen";
import { SummaryScreen } from "../summary/SummaryScreen";
import { useMissionController } from "./hooks/useMissionController";

export function MissionScreen() {   
    const mission = useMissionController()    
    switch (mission.phase) {
        case "idle":
            return (<DashboardScreen onStart={mission.start}/>
            )
        case "playing":            
            if (!mission.currentProblemId) return null
            //const title = `${mission.index+1}/${mission.snapshot?.problemIds.length}: ${mission.currentProblem.title}`
            // TODO: title prefix
            const titlePrefix = `${mission.index+1}/${mission.snapshot?.problemIds.length}: `
            return (
                <PlayerScreen
                    //title={title}
                    titlePrefix={titlePrefix}
                    problemId={mission.currentProblemId}
                    onNextProblem={mission.next}
                    onPrevProblem={mission.prev}
                    onAnswer={(answerResult, secToTaken) => {
                        mission.currentProblemId && 
                            mission.answer(mission.currentProblemId, answerResult, secToTaken)}  
                    }
                />
            )
        case "finished":
            return (
                <SummaryScreen
                    missionResultEntryList={mission.missionResultList}
                    onBackToDashboard={() => { mission.resetPhase()}}
                />
            )
    }
}