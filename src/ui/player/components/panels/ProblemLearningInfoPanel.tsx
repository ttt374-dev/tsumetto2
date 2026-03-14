import type { Problem } from "@/domain/problem/entity/Problem"
import { formatLearningPerformance } from "@/ui/library/components/LibraryListItem"
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore"
import { Box } from "@mui/material"

export default function ProblemLearningInfoPanel(props: {
    problem: Problem
    
}) {
    const { problem } = props
    const records = useLearningRecordStore(s=>s.records)
    const learning = records[problem.id
        
    ]
    return (<>
        <Box>タイプ：{problem.type}</Box>
        {problem.source && <Box>出典：{problem.source}</Box>}
        {problem.tags && <Box>{problem.tags.join(",")}</Box>}

        {learning && formatLearningPerformance(learning)}

    </>)
}
