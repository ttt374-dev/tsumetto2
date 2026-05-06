import { Box } from "@mui/material"

import type { Problem } from "@/domain/problem/entity/Problem"
import { toProblemViewData } from "@/ui/features/problem/hooks/problemPresenter"
import { toLearningStateViewData } from "@/ui/features/learning/hooks/learningPresenter"
import type { LearningState } from "@/domain/learning/entity/LearningState"

export default function ProblemLearningInfoPanel(props: {
    problem: Problem, learningState: LearningState | undefined
}) {
    const { problem, learningState } = props
    return (
        <>
            <ProblemInfoPanel problem={problem} />
            {learningState && <LearningInfoPanel learningState={learningState} />}

        </>)
}
function ProblemInfoPanel({ problem }: { problem: Problem }) {
    const problemVd = toProblemViewData(problem)
    return <>
        <Box>
            {problemVd.type}{problemVd.plyLength}
        </Box>
        {problem.source &&
            <Box>{problem.source}</Box>}
        {problem.tags &&
            <Box>{problemVd.tags}</Box>}
    </>

}
function LearningInfoPanel({learningState}: { learningState: LearningState}){
    const learningStateVd = toLearningStateViewData(learningState)
    return <>
        <Box>
            {learningStateVd.performace}
        </Box>
        <Box>
            {learningStateVd.nextReviewedIn}
        </Box>
        <Box>
            {learningStateVd.masteryStatus}
        </Box>
    </>
}