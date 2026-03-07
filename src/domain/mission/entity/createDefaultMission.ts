import { v4 } from "uuid";
import type { Mission } from "./Mission";
import { DefaultQueryState } from "@/domain/problem/service/query/ProblemsQuery";

const DEFAULT_MISSION_NAME = "new-mission"

export function createDefaultMission(): Mission {
    return {
        id: v4(),
        name: DEFAULT_MISSION_NAME,
        queryState: {...DefaultQueryState},
        createdAt: Date.now(),
        order: 0,
    }
}