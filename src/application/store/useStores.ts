import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";
import { useProblemStore } from "./useProblemStore";
import { useLearningEventStore } from "./useLearningEventStore";
import { useDeckStore } from "./useDeckStore";
import { useMemo } from "react";
import { useLearningRecord } from "../useLearningRecord";


export function useStores(customRepos?: ReturnType<typeof useRepositoryContext>) {
    const repos = customRepos ?? useRepositoryContext()

    //const problem = useProblemStore(repos.problem)
    const learningEvent = useLearningEventStore(repos.learningEvent)
    const learningRecords = useLearningRecord(learningEvent.eventLog)
    const deck = useDeckStore(repos.deck)

    return useMemo(() => ({
        //problem,

        learningEvent,
        learningRecords,
        deck,
        //repos
    }), [learningEvent, learningRecords, deck])
}