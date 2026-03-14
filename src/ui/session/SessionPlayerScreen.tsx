import { useState } from "react"

import PlayerScreen from "../player/PlayerScreen"
import { useSessionPlayerViewModel } from "./hooks/useSessionPlayerViewModel"
import type { SolvedResult } from "@/domain/learning/entity/Learning"
import { SolvedDialog } from "../player/dialogs/SolvedDialog"

////////////////////////////////////////////////
export default function SessionPlayerScreen() {
    const vm = useSessionPlayerViewModel()
    const [openResolved, setOpenResolved] = useState(false)
    const [solvedResult, setSolvedResult] = useState<SolvedResult | undefined>(undefined)

    if (vm.status !== "playing") return <>{vm.status}</>

    const handleResolved = (res: SolvedResult) => {
        vm.submitAnswer(res)
        setOpenResolved(true)
        setSolvedResult(res)
    }
    const handleCloseDialog = () => {

    }
    return (
        <>
            <PlayerScreen problem={vm.problem}
                title={vm.title}
                onResolved={handleResolved}
                onUndoLastAnswer={vm.undoLastAnswer}
            />

            <SolvedDialog open={openResolved}
                onClose={() => setOpenResolved(false)}
                onConfirm={vm.nextProblem}
                solvedResult={solvedResult}
            />
        </>
    )
}

