
import { useEffect } from 'react';

import { useProblemStore } from '@/ui/features/problem/hooks/useProblemStore';
import { useMissionStore } from '@/ui/screens/mission/hooks/useMissionStore';
import { useReviewEventStore } from '@/ui/features/learning/hooks/useReviewEventStore';
import { type RepositoryContextValue } from './providers/RepositoryProvider';
import { useLearningRecordStore } from '@/ui/features/learning/hooks/useLearningRecordStore';

export function useBootstrapStores(repos: RepositoryContextValue) {
    useEffect(() => {
        let cancelled = false

        async function bootstrap() {
            const missionRepo = repos.mission
            const reviewEventRepo = repos.reviewEvent
            const problemRepo = repos.problem

            // Repository injection
            useMissionStore.getState().setRepository(missionRepo)
            useReviewEventStore.getState().setRepository(reviewEventRepo)
            useProblemStore.getState().setRepository(problemRepo)

            // reload
            await reloadAllStores()
            if (cancelled) return

            // projection rebuild
            //rebuildProjections()
        }

        bootstrap()

        return () => {
            cancelled = true
        }
    }, [repos])
}
export async function reloadAllStores(
    { rebuildProjection = true }: { rebuildProjection?: boolean } = {}
) {
    await useMissionStore.getState().reload()
    await useProblemStore.getState().reload()
    await useReviewEventStore.getState().reload()

    if (rebuildProjection) {
        rebuildProjections()
    }
}

export function rebuildProjections() {
    useLearningRecordStore
        .getState()
        .build(
            useReviewEventStore.getState().eventLog
        )
}