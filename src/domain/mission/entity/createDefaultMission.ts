import { v4 } from "uuid";
import type { Mission } from "./Mission";
import { DefaultQueryState } from "@/domain/problem/service/query/QueryState";

const DEFAULT_MISSION_NAME = "for review"

export function createDefaultMission(): Mission {
    return {
        id: v4(),
        name: DEFAULT_MISSION_NAME,
        queryState: {...DefaultQueryState, 
            sortKey: "nextReviewedAt",
            sortOrder: "asc",
            //dueForReviewOnly: true,
        },
        createdAt: Date.now(),
        order: 0,
    }
}