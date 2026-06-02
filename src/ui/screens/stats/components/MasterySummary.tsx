import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { getMasteryStatus, MasteryStatuses, type MasteryStatus } from "@/domain/learning/entity/LearningState";
import { MasteryLevelTextMapping } from "@/ui/features/learning/hooks/learningPresenter";
import { useQueryActiveProblems } from "@/ui/features/problem/hooks/useQueryActiveProblems";
import type { ProblemId } from "@/domain/problem/entity/Problem";
import { HandymanOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { routePaths } from "@/router/paths";
//import { itemsEqual } from "@dnd-kit/sortable/dist/utilities";

function MasterySummaryHeaders(){
    const headers = ["習熟度", "問題数", "割合"]
    return (
        <TableHead>
                <TableRow>
                    { headers.map(h=>(
                        <TableCell key={h}>
                            { h }
                        </TableCell>
                    ))}                    
                </TableRow>
            </TableHead>

    )
}
type MasteryItem = {
    status: MasteryStatus
    label: string
    count: number
    ids: ProblemId[]
}
export function MasterySummary() {
    const records = useLearningRecordStore(s => s.stateRecords)
    //const data: Record<MasteryStatus, number> = {
    //    "unlearned": 0, "learning": 0, "young": 0, "matured": 0, "relearning": 0,
    //}
    const data = Object.fromEntries(
        MasteryStatuses.map(status => [
            status,
            {
                status,
                label: MasteryLevelTextMapping[status],
                count: 0,
                ids: [] as ProblemId[],
            },
        ])
    ) as Record<MasteryStatus, MasteryItem>

    //const ids = useProblemStore(selectActiveProblems).map(p => p.id)
    const ids = useQueryActiveProblems({excludeReferenceOnly: true}).map(p=>p.id)

    for (const id of ids) {
        const learningState = records[id]        
        const status = learningState === undefined ? "unlearned" : getMasteryStatus(learningState)
        data[status].count++
        data[status].ids.push(id)
    }
    const navigate = useNavigate()
    const handleClick = (status: MasteryStatus) => {
        navigate(routePaths.list, { state: { ids: data[status].ids}})
    }
    
    return (<>
        <h4>習熟度</h4>
        <Table>
            <MasterySummaryHeaders/>
            <TableBody>
                {Object.values(data).map(v => (
                    <TableRow key={v.status} onClick={()=>handleClick(v.status)}>
                        <TableCell>{v.label}</TableCell>
                        <TableCell>{v.count}</TableCell>
                        <TableCell>{(v.count / ids.length * 100).toFixed(0)}%</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </>)
}