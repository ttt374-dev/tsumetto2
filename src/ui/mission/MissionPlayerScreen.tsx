import { PlayerScreen } from "../player/PlayerScreen"
import { useLearningEventStore } from "../store/useLearningEventStore"
import { useMissionPlayerViewModel } from "./hooks/useMissionPlayerViewModel"

////////////////////////////////////////////////
export function MissionPlayerScreen() {
    const vm = useMissionPlayerViewModel()
    //console.log("missionplayer", vm)

    if (vm.status !== "playing") return <>{vm.status}</>
    const capabilities = {
        answerable: {
            answer: vm.submitAnswer,
            undoLastAnswer: vm.undoLastAnswer,
        },
        navigatable: vm.problemNavigation
    }
    return (
        <PlayerScreen problem={vm.problem}
            title={vm.title}
            capabilities={capabilities}
        />
    )
}
