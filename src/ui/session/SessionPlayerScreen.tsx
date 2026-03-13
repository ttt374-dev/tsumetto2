import PlayerScreen from "../player/PlayerScreen"
import { useSessionPlayerViewModel } from "./hooks/useSessionPlayerViewModel"

////////////////////////////////////////////////
export default function SessionPlayerScreen() {
    const vm = useSessionPlayerViewModel()

    if (vm.status !== "playing") return <>{vm.status}</>

    return (
        <PlayerScreen problem={vm.problem}
            title={vm.title}
            onResolved={vm.submitAnswer}
            onUndoLastAnswer={vm.undoLastAnswer}
        />
    )
}
