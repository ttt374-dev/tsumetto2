import PlayerScreen from "../player/PlayerScreen"
import { useSessionPlayerViewModel } from "./hooks/useSessionPlayerViewModel"

////////////////////////////////////////////////
export default function SessionPlayerScreen() {
    const vm = useSessionPlayerViewModel()

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
