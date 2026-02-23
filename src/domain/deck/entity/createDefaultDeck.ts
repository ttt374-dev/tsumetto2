import { v4 } from "uuid";
import type { Deck } from "./Deck";
import { DefaultFilterState } from "@/domain/problem/service/query/filter";
import { DefaultSortState } from "@/domain/problem/service/query/sort";

export function createDefaultDeck(): Deck {
    return {
        id: v4(),
        name: "new-deck",
        snapshot: {
            filterState: DefaultFilterState,
            sortState: DefaultSortState,
        },
        createdAt: Date.now(),
        order: 0,
    }
}