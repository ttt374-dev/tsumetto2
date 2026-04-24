import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { getMasteryStatus, type MasteryStatus } from "@/domain/learning/entity/LearningState";
import { MasteryLevelTextMapping } from "@/ui/features/learning/hooks/learningPresenter";
import { useQueryActiveProblems } from "@/ui/features/problem/hooks/useQueryActiveProblems";

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
export function MasterySummary() {
    const records = useLearningRecordStore(s => s.stateRecords)
    const data: Record<MasteryStatus, number> = {
        "unlearned": 0, "learning": 0, "young": 0, "matured": 0, "relearning": 0,
    }

    //const ids = useProblemStore(selectActiveProblems).map(p => p.id)
    const ids = useQueryActiveProblems({excludeReferenceOnly: true}).map(p=>p.id)

    for (const id of ids) {
        const learningState = records[id]
        const mastery = learningState === undefined ? "unlearned" : getMasteryStatus(learningState)
        data[mastery]++
    }
    
    return (<>
        <h4>習熟度</h4>
        <Table>
            <MasterySummaryHeaders/>
            <TableBody>
                {Object.entries(data).map(([k, v]) => (
                    <TableRow>
                        <TableCell>{MasteryLevelTextMapping[k as MasteryStatus]}</TableCell>
                        <TableCell>{v}</TableCell>
                        <TableCell>{(v / ids.length * 100).toFixed(0)}%</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </>)
}