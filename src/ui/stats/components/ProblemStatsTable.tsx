import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useMemo } from "react";
import { GroupedTable, type StatsRowValues } from "./GroupedTable";
import { DefaultFilterState } from "@/domain/problem/service/query/filter";
import { applyFilter } from "@/domain/problem/service/query/applyFilter";
import { DefaultQueryState } from "@/domain/problem/service/query/ProblemsQuery";
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";

export function ProblemStatsTable() {
    const activeProblems = useProblemStore(s => s.activeProblems)
    const learningRecords = useLearningRecordStore(s => s.records)

    const queryState = { ...DefaultQueryState, dueForReviewOnly: true}
    const dueForReviewOnly = applyFilter(activeProblems, learningRecords, queryState)
    console.log("due review", dueForReviewOnly)

    // 総合
    const unanswered = activeProblems.filter(p => { learningRecords[p.id]?.totalCount > 0 })
    const idsMap: Record<string, Record<string, Problem[]>> = {}

    idsMap["general"] =  {
        "全問題": activeProblems,
        "未完了": unanswered,
        "レビュー対象": dueForReviewOnly,
    }
    

    // 出典
    const allSources = useProblemStore(s=>s.allSources)
    const sourcesTatsRows = useMemo(()=>
        allSources.map(source=>{
            const filteredIds = activeProblems
                .filter(p=>p.source===source)
                .map(p=>p.id)
            return { 
                label: source, 
                stats: ProblemStats.create(filteredIds, learningRecords)
            }
        }), [allSources, activeProblems, learningRecords])
    

    // 手数
    const mate3 = activeProblems.filter(p => p.kifData.moves.length <= 3)
    const mate5 = activeProblems.filter(p => p.kifData.moves.length === 5)
    const mate7 = activeProblems.filter(p => p.kifData.moves.length === 7)
    const mate9 = activeProblems.filter(p => p.kifData.moves.length >= 9)
    idsMap["mateLength"] = {
        "3手まで": mate3,
        "5手": mate5,
        "7手": mate7,
        "9手以上": mate9,
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
            rows: statsMapToRows(idsMap["general"]),
        },
        {
            groupName: "出典",
            rows: sourcesTatsRows,
        },
        {
            groupName: "指し手数",
            rows: statsMapToRows(idsMap["mateLength"]),
        },
        {
            groupName: "タグ",
            rows: tagStatsRows,
        }
    ]
    const columns = ["問題数", "正答率", "E/F", "間隔"]

    return (
        <GroupedTable groups={groups} columns={columns} />
    )

    ///////////////////////
    function statsMapToRows(statsMap: Record<string, Problem[]>): StatsRowValues[] {
        return Object.entries(statsMap).map(([label, problems]) => ({
            label,
            stats: ProblemStats.create(problems.map(p=>p.id), learningRecords),
        }))
    }
}


