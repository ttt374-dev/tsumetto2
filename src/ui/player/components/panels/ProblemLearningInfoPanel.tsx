import type { Problem } from "@/domain/problem/entity/Problem"
import { toLearningViewData } from "@/ui/presenter/learningPresenter"
import { problemPresenter } from "@/ui/presenter/problemPresenter"
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore"
import { Box } from "@mui/material"

export default function ProblemLearningInfoPanel(props: {
    problem: Problem    
}) {
    const { problem } = props
    const records = useLearningRecordStore(s=>s.records)
    const learning = records[problem.id]
    const pp = problemPresenter

    const learningVm = toLearningViewData(learning)

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
                    { learningVm.performaceText }
                </Box>
                <Box>
                    { learningVm.nextReviewedInText}
                </Box>

            </>}

    </>)
}
