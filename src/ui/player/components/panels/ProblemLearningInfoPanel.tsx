import type { Problem } from "@/domain/problem/entity/Problem"
import { toLearningViewData } from "@/ui/presenter/learningPresenter"
import { toProblemViewData } from "@/ui/presenter/problemPresenter"
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore"
import { Box } from "@mui/material"

export default function ProblemLearningInfoPanel(props: {
    problem: Problem    
}) {
    const { problem } = props
    const records = useLearningRecordStore(s=>s.records)
    const learning = records[problem.id]   

    const problemVd = toProblemViewData(problem)
    const learningVd = toLearningViewData(learning)

    return (<>
        <Box>
            問題タイプ：{problemVd.typeText}
        </Box>
        {problem.source && 
            <Box>
                出典：{problem.source}</Box>}
        {problem.tags && 
            <Box>{problemVd.tagsText}</Box>}

        {learning && 
            <>
                <Box>
                    { learningVd.performaceText }
                </Box>
                <Box>
                    { learningVd.nextReviewedInText}
                </Box>

            </>}

    </>)
}
