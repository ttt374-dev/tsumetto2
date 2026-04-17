import { List, ListItem, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore";
import { getMasteryStatus, type MasteryStatus } from "@/domain/learning/entity/LearningState";
import { selectActiveProblems, useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { MasteryLevelTextMapping } from "@/ui/features/learning/hooks/learningPresenter";

export function MasterySummary() {
    const records = useLearningRecordStore(s => s.stateRecords)
    const data: Record<MasteryStatus, number> = {
        "unlearned": 0, "learning": 0, "young": 0, "matured": 0, "relearning": 0,
    }

    const ids = useProblemStore(selectActiveProblems).map(p => p.id)

    for (const id of ids) {
        const learningState = records[id]
        const mastery = learningState === undefined ? "unlearned" : getMasteryStatus(learningState)
        data[mastery]++
    }

    return (<>
        <h4>習熟度</h4>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        習熟度
                    </TableCell>
                    <TableCell>
                        問題数
                    </TableCell>
                    <TableCell>
                        割合
                    </TableCell>
                </TableRow>
            </TableHead>

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