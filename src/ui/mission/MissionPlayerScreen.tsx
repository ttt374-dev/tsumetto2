import { PlayerScreen } from "../player/PlayerScreen"
import { useMissionPlayerViewModel } from "./hooks/useMissionPlayerViewModel"

////////////////////////////////////////////////
export function MissionPlayerScreen() {

    const vm = useMissionPlayerViewModel()
    //console.log("missionplayer", vm)

    if (vm.status !== "playing") return <>{vm.status}</>

    return (
        <PlayerScreen problem={vm.problem}
            title={vm.title}
            onAnswer={vm.handleAnswer}
            problemNavigation={vm.problemNavigation}
        />
    )
}
