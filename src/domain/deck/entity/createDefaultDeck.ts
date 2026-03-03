import { v4 } from "uuid";
import type { Deck } from "./Deck";
import { DefaultFilterState } from "@/domain/problem/service/query/filter";
import { DefaultSortState } from "@/domain/problem/service/query/sort";
import { DefaultProblemsQuery } from "@/domain/problem/service/query/ProblemsQuery";

export function createDefaultDeck(): Deck {
    return {
        id: v4(),
        name: "new-deck",
        snapshot: {
            queryState: DefaultProblemsQuery,
            //filterState: DefaultFilterState,
            //sortState: DefaultSortState,
        },
        createdAt: Date.now(),
        order: 0,
    }
}