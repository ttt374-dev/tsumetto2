import { v4 } from "uuid";
import type { Deck } from "./Deck";
import { DefaultQueryState } from "@/domain/problem/service/query/ProblemsQuery";

const DEFAULT_DECK_NAME = "new-deck"

export function createDefaultDeck(): Deck {
    return {
        id: v4(),
        name: DEFAULT_DECK_NAME,
        queryState: {...DefaultQueryState},
        createdAt: Date.now(),
        order: 0,
    }
}