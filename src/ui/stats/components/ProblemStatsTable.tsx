import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useMemo } from "react";
import { GroupedTable, type StatsRowValues } from "./GroupedTable";

export function ProblemStatsTable() {
    const activeProblems = useProblemStore(s => s.activeProblems)
    const learningRecords = useLearningRecordStore(s => s.records)

    // 総合
    const unanswered = activeProblems.filter(p => { learningRecords[p.id]?.totalCount > 0 })
    const statsMapGeneral = {
        "全問題": ProblemStats.create(activeProblems.map(p => p.id), learningRecords),
        "未完了": ProblemStats.create(unanswered.map(p => p.id), learningRecords),
    }
    // 手数
    const mate3 = activeProblems.filter(p => p.kifData.moves.length <= 3)
    const mate5 = activeProblems.filter(p => p.kifData.moves.length === 5)
    const mate7 = activeProblems.filter(p => p.kifData.moves.length === 7)
    const mate9 = activeProblems.filter(p => p.kifData.moves.length >= 9)

    const statsMapMates = {
        "3手まで": ProblemStats.create(mate3.map(p => p.id), learningRecords),
        "5手": ProblemStats.create(mate5.map(p => p.id), learningRecords),
        "7手": ProblemStats.create(mate7.map(p => p.id), learningRecords),
        "9手以上": ProblemStats.create(mate9.map(p => p.id), learningRecords),
    }
    // タグ
    const allTags = useProblemStore(s => s.allTags)
    const tagStatsRows = useMemo(
        () =>
            allTags.map(tag => {
                const filteredIds = activeProblems
                    .filter(p => p.tags.includes(tag))
                    .map(p => p.id)

                return {
                    label: tag,
                    stats: ProblemStats.create(filteredIds, learningRecords)
                }
            }),
        [allTags, activeProblems, learningRecords]
    )
    const groups = [
        {
            groupName: "総合",
            rows: statsMapToRows(statsMapGeneral),
        },
        {
            groupName: "指し手数",
            rows: statsMapToRows(statsMapMates),
        },
        {
            groupName: "タグ",
            rows: tagStatsRows,
        }
    ]
    const columns = ["問題数", "正答数", "E/F", "間隔"]

    return (
        <GroupedTable groups={groups} columns={columns} />
    )

}

///////////////////////
function statsMapToRows(statsMap: Record<string, ProblemStats>): StatsRowValues[] {
    return Object.entries(statsMap).map(([label, stats]) => ({
        label,
        stats
    }))
}