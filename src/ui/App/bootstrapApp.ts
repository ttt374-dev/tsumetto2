
import { useEffect, useMemo } from 'react';
import { useProblemStore } from '@/ui/store/useProblemStore';
import { MissionRepository, LocalStorageMissionPersistence } from '@/domain/mission/repository/MissionRepository';
import { useMissionStore } from '@/ui/mission/hooks/useMissionStore';
import { LocalStorageReviewEventPersistence, ReviewEventRepository } from '@/domain/learning/repository/ReviewEventRepository';
import { useReviewEventStore } from '@/ui/store/useReviewEventStore';
import { RepositoryContext, type RepositoryContextValue } from './providers/RepositoryProvider';
import { LocalStrorageProblemPersistence, ProblemRepository } from '@/domain/problem/repository/ProblemRepository';
import { initializeAppUsecase } from '@/application/usecase/initializeApp/useInitializeAppUsecase';
import { debounce } from 'lodash';
import type { Mission } from '@/domain/mission/entity/Mission';
import type { ReviewEventLog } from '@/domain/learning/entity/ReviewEvent';
import type { Problem, ProblemId } from '@/domain/problem/entity/Problem';

export function createRepositories() {
    return {
        problem: new ProblemRepository(new LocalStrorageProblemPersistence()),
        reviewEvent: new ReviewEventRepository(new LocalStorageReviewEventPersistence()),
        mission: new MissionRepository(new LocalStorageMissionPersistence()),
    }
}
export function bootstrapApp(repos: RepositoryContextValue) {
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

        
        // subscribe 設定
        const saveMissionRepo = debounce(async (missions: Mission[]) => 
            missionRepo.replaceAll(missions), 1000)        
        const saveLearningRepo = debounce(async (eventLog: ReviewEventLog) => {
            //console.log("debouncce save")
            learningRepo.replaceAll(eventLog), 1000})
        
        const saveProblemRepo = debounce(async (byId: Record<ProblemId, Problem>) => 
            problemRepo.replaceAll(Object.values(byId)), 1000)       


        const missionUnsub = useMissionStore.subscribe(state => {
            if (isInitializing) return           
            saveMissionRepo(state.missions)      
        })
        const learningUnsub = useReviewEventStore.subscribe(state => {
            if (isInitializing) return
            saveLearningRepo(state.eventLog)
        })
        const problemUnSub = useProblemStore.subscribe(state => {
            if (isInitializing) return 
            saveProblemRepo(state.byId)
        })
        
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

        
        // クリーンアップ
        return () => {
            missionUnsub()
            saveMissionRepo.flush?.()
            learningUnsub()
            saveLearningRepo.flush?.()
            problemUnSub()
            saveProblemRepo.flush?.()
        }
    }, [repos])
    
}