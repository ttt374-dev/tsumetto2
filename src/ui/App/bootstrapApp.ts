
import { useEffect } from 'react';

import { useProblemStore } from '@/ui/domains/problem/hooks/useProblemStore';
import { MissionRepository, LocalStorageMissionPersistence } from '@/domain/mission/repository/MissionRepository';
import { useMissionStore } from '@/ui/screens/mission/hooks/useMissionStore';
import { LocalStorageReviewEventPersistence, ReviewEventRepository } from '@/domain/review/repository/ReviewEventRepository';
import { useReviewEventStore } from '@/ui/domains/learning/hooks/useReviewEventStore';
import { type RepositoryContextValue } from './providers/RepositoryProvider';
import { LocalStrorageProblemPersistence, ProblemRepository } from '@/domain/problem/repository/ProblemRepository';
import { initializeAppUsecase } from '@/application/usecase/initializeApp/useInitializeAppUsecase';
import { ReviewSyncService } from '@/application/reviewSyncService';

export function createRepositories() {
    return {
        problem: new ProblemRepository(new LocalStrorageProblemPersistence()),
        reviewEvent: new ReviewEventRepository(new LocalStorageReviewEventPersistence()),
        mission: new MissionRepository(new LocalStorageMissionPersistence()),
    }
}
export function bootstrapApp(repos: RepositoryContextValue){
    useEffect(() => {
        const syncService = new ReviewSyncService()
        syncService.start()
    }, [])

    useEffect(() => {
        const missionRepo = repos.mission
        const reviewEventRepo = repos.reviewEvent
        const problemRepo = repos.problem

        // Repository 注入
        useMissionStore.getState().setRepository(missionRepo)
        useReviewEventStore.getState().setRepository(reviewEventRepo)
        useProblemStore.getState().setRepository(problemRepo)

        // 初期化フラグ
        let isInitializing = true        
        // bootstrap 本体
        const bootstrap = async () => {
            await initializeAppUsecase(missionRepo)
            await useMissionStore.getState().reload()
            await useProblemStore.getState().reload()
            await useReviewEventStore.getState().reload()

            // 初期化完了
            isInitializing = false
        }
        bootstrap()
    }, [repos])
    
}