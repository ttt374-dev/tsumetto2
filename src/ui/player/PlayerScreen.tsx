import type { FsmState } from "@/domain/fsm/Fsm"
import { useStoreContext } from "../App/providers/StoreProvider"
import type { Problem } from "@/domain/problem/Problem"
import { useFsmContext } from "../App/providers/fsmPRovider"
import { Button, List, ListItem } from "@mui/material"
import { useMissionItem } from "../../application/useMissionItem"

export function PlayerScreen() {
    const { state: fsmState, next, prev, solve, fail,
        advancePhase, retreatPhase,
    } = useFsmContext()

    const { missionItems, handleAnswer, handleToggleStar } = useMissionItem()

    const problemId = fsmState.queue[fsmState.currentIndex]?.problemId
    const missionItem = missionItems.find((m) => m.problem.id === problemId)

    if (!missionItem) return (<>NO MISSION</>)

    return (
        <>
            <List>
                <ListItem>
                    Id: {missionItem.problem.id}
                </ListItem>
                <ListItem onClick={() => { handleToggleStar(missionItem) }}>
                    Star: {missionItem.problem.starred ? "★" : "☆"}
                </ListItem>

                <ListItem>
                    solvedcount: {missionItem.learning?.solvedCount}
                </ListItem>
            </List>


            <Button onClick={() => { handleAnswer(missionItem) }}>
                Answer
            </Button>
            <Button onClick={next}>
                Next
            </Button>

        </>
    )
}