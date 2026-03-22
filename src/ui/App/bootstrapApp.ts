
import { useEffect, useMemo } from 'react';
import { useProblemStore } from '@/ui/store/useProblemStore';
import { MissionRepository, LocalStorageMissionPersistence } from '@/domain/mission/repository/MissionRepository';
import { useMissionStore } from '@/ui/mission/hooks/useMissionStore';
import { LocalStorageLearningEventPersistence, LearningEventRepository } from '@/domain/learning/repository/LearningEventRepository';
import { useLearningEventStore } from '@/ui/store/useLearningEventStore';
import { RepositoryContext, type RepositoryContextValue } from './providers/RepositoryProvider';
import { LocalStrorageProblemPersistence, ProblemRepository } from '@/domain/problem/repository/ProblemRepository';
import { initializeAppUsecase } from '@/application/usecase/initializeApp/useInitializeAppUsecase';
import { debounce } from 'lodash';
import type { Mission } from '@/domain/mission/entity/Mission';
import type { LearningEventLog } from '@/domain/learning/entity/LearningEvent';
import type { Problem, ProblemId } from '@/domain/problem/entity/Problem';

export function createRepositories() {
    return {
        problem: new ProblemRepository(new LocalStrorageProblemPersistence()),
        learningEvent: new LearningEventRepository(new LocalStorageLearningEventPersistence()),
        mission: new MissionRepository(new LocalStorageMissionPersistence()),
    }
}
export function bootstrapApp(repos: RepositoryContextValue) {
    useEffect(() => {
        const missionRepo = repos.mission
        const learningRepo = repos.learningEvent
        const problemRepo = repos.problem

        // Repository 注入
        useMissionStore.getState().setRepository(missionRepo)
        useLearningEventStore.getState().setRepository(learningRepo)
        useProblemStore.getState().setRepository(problemRepo)

        // 初期化フラグ
        let isInitializing = true

        
        // subscribe 設定
        const saveMissionRepo = debounce(async (missions: Mission[]) => 
            missionRepo.replaceAll(missions), 1000)        
        const saveLearningRepo = debounce(async (eventLog: LearningEventLog) => {
            //console.log("debouncce save")
            learningRepo.replaceAll(eventLog), 1000})
        
        const saveProblemRepo = debounce(async (byId: Record<ProblemId, Problem>) => 
            problemRepo.replaceAll(Object.values(byId)), 1000)       


        const missionUnsub = useMissionStore.subscribe(state => {
            if (isInitializing) return           
            saveMissionRepo(state.missions)      
        })
        const learningUnsub = useLearningEventStore.subscribe(state => {
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
            await useLearningEventStore.getState().reload()

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