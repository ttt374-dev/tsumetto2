import { useFsmContext } from "../App/providers/fsmPRovider"
import { Button, List, ListItem } from "@mui/material"
import { useMissionItem } from "../../application/useMissionItem"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function PlayerScreen() {
    const { state: fsmState, next, prev, solve, fail,
        advancePhase, retreatPhase,
    } = useFsmContext()

    const { missionItems, markAnswer, toggleStar } = useMissionItem()

    const problemId = fsmState.queue[fsmState.currentIndex]?.problemId
    const missionItem = missionItems.find((m) => m.problem.id === problemId)

    const navigate = useNavigate()

    useEffect(() => {
        if (fsmState.isFinished) {
            //navigate("/dashboard")
            navigate("/summary", { state: { fsmState } })
        }
    }, [fsmState.isFinished, navigate]);

    
    if (!missionItem) return (<>NO MISSION</>)

    return (
        <>
            <List>
                <ListItem>
                    Id: {missionItem.problem.id}
                </ListItem>
                <ListItem onClick={() => { toggleStar(missionItem) }}>
                    Star: {missionItem.problem.starred ? "★" : "☆"}
                </ListItem>

                <ListItem>
                    solvedcount: {missionItem.learning?.solvedCount} / 
                    failedcount: {missionItem.learning?.failedCount} / 
                </ListItem>
                <ListItem>
                    {missionItem.learning?.intervalDays} / 
                    {missionItem.learning && new Date(missionItem.learning.nextReviewedAt).toLocaleString()} / 
                    { missionItem.learning?.easeFactor}
                </ListItem>
            </List>


            <Button onClick={() => { markAnswer(missionItem, "solved")}}>
                Solved
            </Button>
            <Button onClick={() => { markAnswer(missionItem, "failed") }}>
                Failed
            </Button>
            <Button onClick={next}>
                Next
            </Button>

        </>
    )
}