import { Box } from "@mui/material"

import type { Problem } from "@/domain/problem/entity/Problem"
import { toProblemViewData } from "@/ui/features/problem/hooks/problemPresenter"
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore"
import { toLearningStateViewData } from "@/ui/features/learning/hooks/learningPresenter"

export default function ProblemLearningInfoPanel(props: {
    problem: Problem    
}) {
    const { problem } = props
    const learningState = useLearningRecordStore(s=>s.getState(problem.id))
    const learningStateVd = learningState && toLearningStateViewData(learningState)

    const problemVd = toProblemViewData(problem)

    return (<>
        <Box>
            問題タイプ：{problemVd.typeText}
        </Box>
        {problem.source && 
            <Box>
                出典：{problem.source}</Box>}
        {problem.tags && 
            <Box>{problemVd.tagsText}</Box>}

        {learningStateVd && 
            <>
                <Box>
                    { learningStateVd.performaceText }
                </Box>
                <Box>
                    { learningStateVd.nextReviewedInText}
                </Box>

            </>}

    </>)
}
