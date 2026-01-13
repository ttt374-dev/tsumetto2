import { useFsmContext } from "../App/providers/fsmPRovider"
import { Box, Button, List, ListItem, Stack } from "@mui/material"
import { useMissionItem } from "../../application/useMissionItem"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AppLayout } from "../common/AppLayout"
import BoardView from "./components/BoardView"
import { useBoardReplay } from "./hooks/useBoardReplay"
import { createKifContent } from "@/domain/kif/factory"

export function PlayerScreen() {
    const { state: fsmState, next, prev, solve, fail,
        advancePhase, retreatPhase,
    } = useFsmContext()

    const { missionItems, markAnswer, toggleStar } = useMissionItem()

    const problemId = fsmState.queue[fsmState.currentIndex]?.problemId
    const missionItem = missionItems.find((m) => m.problem.id === problemId)

    const navigate = useNavigate()

    // 最後のインデックスだったらサマリーに遷移
    useEffect(() => {
        if (fsmState.isFinished) {
            navigate("/summary", { state: { fsmState } })
        }
    }, [fsmState.isFinished, navigate]);

    // answer から次へ自動遷移
    useEffect(() => {
        if (fsmState.phase === "answered")
            next()
    }, [fsmState.phase])

    // 問題が変わったら手筋をリセット
    useEffect(() => {
        if (!fsmState) return

        //timer.reset()
        //timer.start()
        resetPly()
    }, [fsmState.currentIndex])

    const kifContent = missionItem?.problem.kifContent ?? createKifContent()
    const { board, hands, moves, currentPlyIndex,
        advancePly, retreatPly,
        moveToPly, resetPly,
    } = useBoardReplay(kifContent)


    if (!missionItem) {
        return (
            <>
                NO MISSION
                <Button onClick={() => { navigate("/dashboard") }}>
                    Back
                </Button>
            </>)
    }

    return (
        <AppLayout
            header={missionItem.problem.title}
            footer={
                <Stack direction="row" spacing={1}>
                    <Button fullWidth variant="contained" onClick={() => { markAnswer(missionItem, "failed"); fail() }}>
                        Failed
                    </Button>

                    <Button fullWidth variant="contained" onClick={() => { markAnswer(missionItem, "solved"); solve() }}>
                        Solved
                    </Button>
                    <Button fullWidth variant="contained" onClick={() => { markAnswer(missionItem, "solved", 3); solve() }}>
                        easy
                    </Button>


                </Stack>
            }
        >
            <BoardView board={board} hands={hands} />


            <Stack direction="row">
                <Button onClick={prev}>
                    Prev
                </Button>
                <Button onClick={retreatPly}>
                    Ret Ply
                </Button>

                <Button onClick={advancePly}>
                    Adv Ply
                </Button>
                <Button onClick={next}>
                    Next
                </Button>
            </Stack>
            {missionItem.learning &&
                <Stack direction="row" spacing={2}>
                    <Box>
                        {missionItem.learning.solvedCount} /
                        {missionItem.learning.totalCount}
                    </Box>
                    <Box>
                        ef{missionItem.learning.easeFactor.toFixed(2)},
                        reviewed at {new Date(missionItem.learning.nextReviewedAt).toLocaleString()}
                    </Box>


                </Stack>
            }
        </AppLayout>
    )
}