import type { Problem } from "@/domain/problem/entity/Problem"
import { learningPresenter } from "@/ui/learning/learningPresenter"
import { problemPresenter } from "@/ui/problem/presenter/problemPresenter"
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore"
import { Box } from "@mui/material"

export default function ProblemLearningInfoPanel(props: {
    problem: Problem    
}) {
    const { problem } = props
    const records = useLearningRecordStore(s=>s.records)
    const learning = records[problem.id]
    const lp = learningPresenter
    const pp = problemPresenter

    return (<>
        <Box>
            {pp.type.label}：{pp.type.getText(problem)}
        </Box>
        {problem.source && 
            <Box>
                {pp.source.label}：{problem.source}</Box>}
        {problem.tags && 
            <Box>{pp.tags.getText(problem)}</Box>}

        {learning && 
            <>
                <Box>
                    { lp.performance.getText(learning) }
                </Box>
                <Box>
                    { lp.nextReviewedIn.getText(learning)}
                </Box>

            </>}

    </>)
}
