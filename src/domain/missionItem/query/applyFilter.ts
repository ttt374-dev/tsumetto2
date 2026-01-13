import type { Problem } from "@/domain/problem/Problem";
import type { FilterState } from "./filter";
import type { MissionItem } from "../MissionItem";

function matchesText(problem: Problem, text?: string): boolean {
    if (!text) return true;
    const t = text.toLowerCase();
    return (
        problem.title?.toLowerCase().includes(t)        
    );
}
//////////////////////////////////
export const applyFilter = (
    missionItems: MissionItem[],
    //problems: Problem[],
    filter: FilterState,
    //learningRecords?: LearningRecord,
): MissionItem[] => {
    const now = Date.now();
    //console.log("filter problems", filter, learningRecords)
    return missionItems.filter(item => {
        const learning = item.learning

        // 未回答のみ
        if (filter.unansweredOnly && learning && (learning.solvedCount + learning.failedCount > 0)){
                return false
        }        
        
        // ミッション対象
        if (filter.isMissionTarget &&
            learning?.nextReviewedAt !== undefined &&
            learning.nextReviewedAt > now
        ){
            return false
        }
       

        // スターつきのみ
        if (filter.starredOnly &&
            !item.problem.starred){
            return false
        }

        /*
        // text
        if (!matchesText(problem, filter.text)) {
            //console.log("-- filter: text")
            return false;
        }
            */
        //console.log("=== returning TRUE", problem.id)
        return true;
    });
}