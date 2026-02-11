import { useMemo } from "react";
import { ProblemStats } from "@/domain/problem/ProblemStats";
import type { LearningRecord } from "@/domain/learning/Learning";
import type { Deck } from "@/domain/deck/Deck";
import type { Problem } from "@/domain/problem/Problem";
import { applyFilter } from "@/domain/problem/query/applyFilter";

type Stores = {
    deck: { decks: Deck[] };
    problem: { problems: Problem[] };
};

export function useDeckStats(stores: Stores, learningRecords: LearningRecord) {
    const deckStats = useMemo(() => {
        const map = new Map<string, ProblemStats>();

        for (const deck of stores.deck.decks) {
            // デッキに対応する問題をフィルタ
            const filteredProblems = applyFilter(
                stores.problem.problems,
                learningRecords,
                deck.snapshot.filterState
            );

            // ProblemStats を直接計算
            const stats = ProblemStats.create(filteredProblems.map(p => p.id), learningRecords);

            map.set(deck.id, stats);
        }

        return map;
    }, [stores.deck.decks, stores.problem.problems, learningRecords]);

    return deckStats;
}
