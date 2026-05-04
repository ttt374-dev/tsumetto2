import { Box } from "@mui/material"

import type { Problem } from "@/domain/problem/entity/Problem"
import { toProblemViewData } from "@/ui/features/problem/hooks/problemPresenter"
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore"
import { toLearningStateViewData } from "@/ui/features/learning/hooks/learningPresenter"
import type { LearningState } from "@/domain/learning/entity/LearningState"

export default function ProblemLearningInfoPanel(props: {
    problem: Problem, learningState?: LearningState
}) {
    const { problem } = props
    //const learningState = useLearningRecordStore(s => s.getState(problem.id))
    const learningStateVd = props.learningState && toLearningStateViewData(props.learningState)
    const problemVd = toProblemViewData(problem)

    return (
        <>
            <Box>
                {problemVd.type}{problemVd.plyLength}
            </Box>
            {problem.source &&
                <Box>{problem.source}</Box>}
            {problem.tags &&
                <Box>{problemVd.tags}</Box>}

            {learningStateVd &&
                <>
                    <Box>
                        {learningStateVd.performace}
                    </Box>
                    <Box>
                        {learningStateVd.nextReviewedIn}
                    </Box>
                    <Box>
                        {learningStateVd.masteryStatus}
                    </Box>
                </>}
        </>)
}
