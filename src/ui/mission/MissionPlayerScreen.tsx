import { useMissionStore } from "@/application/store/useMissionStore"
import { useProblemStore } from "@/application/store/useProblemStore"
import type { Problem } from "@/domain/problem/Problem"
import { PlayerScreen } from "../player/PlayerScreen"
import { useDeckStore } from "@/application/store/useDeckStore"
import { useCallback, useMemo } from "react"
import type { SolvedResult } from "@/domain/learning/Learning"
import { useMissionPlayerViewModel } from "./hooks/useMissionPlayerViewModel"
import { Box } from "@mui/material"

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
                    navigationHandlers={vm.navigationHandlers}
                />
            )
    }


}
