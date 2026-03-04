import { v4 } from "uuid";
import type { Deck } from "./Deck";
import { DefaultQueryState } from "@/domain/problem/service/query/ProblemsQuery";

export function createDefaultDeck(): Deck {
    return {
        id: v4(),
        name: "new-deck",
        snapshot: {
            queryState: DefaultQueryState,
            //filterState: DefaultFilterState,
            //sortState: DefaultSortState,
        },
        createdAt: Date.now(),
        order: 0,
    }
}