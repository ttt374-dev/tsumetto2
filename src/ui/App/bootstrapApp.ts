
import { useEffect, useMemo } from 'react';
import { useProblemStore } from '@/ui/store/useProblemStore';
import { MissionRepository, LocalStorageMissionPersistence } from '@/domain/mission/repository/MissionRepository';
import { useMissionStore } from '@/ui/mission/hooks/useMissionStore';
import { LocalStorageReviewEventPersistence, ReviewEventRepository } from '@/domain/review/repository/ReviewEventRepository';
import { useReviewEventStore } from '@/ui/store/useReviewEventStore';
import { RepositoryContext, type RepositoryContextValue } from './providers/RepositoryProvider';
import { LocalStrorageProblemPersistence, ProblemRepository } from '@/domain/problem/repository/ProblemRepository';
import { initializeAppUsecase } from '@/application/usecase/initializeApp/useInitializeAppUsecase';
import { bindKey, debounce } from 'lodash';
import type { Mission } from '@/domain/mission/entity/Mission';
import type { ReviewEventLog } from '@/domain/review/ReviewEvent';
import type { Problem, ProblemId } from '@/domain/problem/entity/Problem';
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
        const learningRepo = repos.reviewEvent
        const problemRepo = repos.problem

        // Repository 注入
        useMissionStore.getState().setRepository(missionRepo)
        useReviewEventStore.getState().setRepository(learningRepo)
        useProblemStore.getState().setRepository(problemRepo)

        // 初期化フラグ
        let isInitializing = true

        const saveMissionRepo = async (missions: Mission[]) => {
            missionRepo.replaceAll(missions)
        }
        const saveLearningRepo = async (eventLog: ReviewEventLog) => {
            learningRepo.replaceAll(eventLog)
        }
        const saveProblemRepo = async (byId: Record<ProblemId, Problem>) => {
            problemRepo.replaceAll(Object.values(byId))
        }
        
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