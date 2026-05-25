
import { useEffect } from 'react';

import { useProblemStore } from '@/ui/features/problem/hooks/useProblemStore';
import { useMissionStore } from '@/ui/screens/mission/hooks/useMissionStore';
import { useReviewEventStore } from '@/ui/features/learning/hooks/useReviewEventStore';
import { type RepositoryContextValue } from './providers/RepositoryProvider';

export function useBootstrapStores(repos: RepositoryContextValue) {
    useEffect(() => {
        const missionRepo = repos.mission
        const reviewEventRepo = repos.reviewEvent
        const problemRepo = repos.problem

        // Repository 注入
        useMissionStore.getState().setRepository(missionRepo)
        useReviewEventStore.getState().setRepository(reviewEventRepo)
        useProblemStore.getState().setRepository(problemRepo)

        // 初期化フラグ
        //let isInitializing = true
        // bootstrap 本体

        reloadStores()
    }, [repos])
    const reloadStores = async () => {
        //await initializeAppUsecase(missionRepo)
        await useMissionStore.getState().reload()
        await useProblemStore.getState().reload()
        await useReviewEventStore.getState().reload()

        // 初期化完了
        //isInitializing = false
    }
}