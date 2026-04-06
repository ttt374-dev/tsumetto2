import { useState, useEffect, useCallback, useMemo } from "react";
import { arrayMove } from "@dnd-kit/sortable";

import { useMissionStore } from "@/ui/mission/hooks/useMissionStore";
import { selectActiveProblems, useProblemStore } from "@/ui/store/useProblemStore";
import { useLearningRecordStore } from "@/ui/domains/learning/useLearningRecordStore";
import { applyFilter } from "@/domain/problem/service/query/applyFilter";
import type { Mission } from "@/domain/mission/entity/Mission";
import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { DefaultQueryState } from "@/domain/problem/service/query/ProblemsQuery";

export function useMissionViewModel() {
    // Store
    const missions = useMissionStore(s => s.missions);
    const replaceAll = useMissionStore(s => s.replaceAll);

    // UIローカルな並び状態（DnD用）
    const [missionArray, setMissionArray] = useState<Mission[]>([]);
    const { reorder } = useMissionReorder(missionArray, setMissionArray, replaceAll);

    // missions が更新されたら UI 配列を order 順にセット
    useEffect(() => {
        const sorted = [...missions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setMissionArray(sorted);
    }, [missions]);

    const { missionStats} = useMissionStats(missionArray)

    return {
        missionArray,
        onDragEnd: reorder,
        //missionStats,
    };
}
/////////////

function useMissionStats(missionArray: Mission[]){
    ///////////
    // missionArray に基づく stats
    const problems = useProblemStore(selectActiveProblems);
    const learningRecords = useLearningRecordStore(s => s.records);
    
    const missionStats = useMemo(() => {
        const map = new Map<string, ProblemStats>();
        for (const mission of missionArray) {            
            const filtered = applyFilter(problems, learningRecords, mission.queryState ?? DefaultQueryState);
            const stats = ProblemStats.create(filtered.map(p => p.id), learningRecords);
            map.set(mission.id, stats);
        }
        return map;
    }, [missionArray, problems, learningRecords]);

    return { missionStats}

}
/////////////////////////
function useMissionReorder(
    missionArray: Mission[],
    setMissionArray: (v: Mission[]) => void,
    replaceAll: (missions: Mission[]) => void
) {
    const reorder = useCallback(
        (activeId: string | number, overId: string | number | null) => {
            if (!overId || activeId === overId) return;

            const oldIndex = missionArray.findIndex(d => d.id === activeId);
            const newIndex = missionArray.findIndex(d => d.id === overId);
            if (oldIndex === -1 || newIndex === -1) return;

            const newArray = arrayMove(missionArray, oldIndex, newIndex);

            // UI更新
            setMissionArray(newArray);

            // 永続化
            const updated = newArray.map((d, i) => ({ ...d, order: i }));
            replaceAll(updated);
        },
        [missionArray, setMissionArray, replaceAll]
    );

    return { reorder };
}