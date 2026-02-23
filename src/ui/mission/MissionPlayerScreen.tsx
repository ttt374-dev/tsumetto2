import { PlayerScreen } from "../player/PlayerScreen"
import { useMissionPlayerViewModel } from "./hooks/useMissionPlayerViewModel"

////////////////////////////////////////////////
export function MissionPlayerScreen() {

    const vm = useMissionPlayerViewModel()
    console.log("missionplayer", vm)

    switch (vm.status) {
        case "loading": return <>Loading..</>
        case "finished": return <>Finished</>
        case "idle": return <>Idel</>        
        case "missing": return <>Missing</>
        case "playing":
            return (
                <PlayerScreen problem={vm.problem}
                    title={vm.title}
                    onAnswer={vm.handleAnswer}
                    problemNavigation={vm.problemNavigation}
                />
            )
    }


}
