import { PlayerScreen } from "../player/PlayerScreen"
import { useMissionPlayerViewModel } from "./hooks/useMissionPlayerViewModel"

////////////////////////////////////////////////
export function MissionPlayerScreen() {
    const vm = useMissionPlayerViewModel()
    //console.log("missionplayer", vm)

    if (vm.status !== "playing") return <>{vm.status}</>

    const capabilities = {
        answer: {
            answer: vm.handleAnswer,
        },
        navigation: vm.problemNavigation
    }
    return (
        <PlayerScreen problem={vm.problem}
            title={vm.title}
            capabilities={capabilities}
        />
    )
}
