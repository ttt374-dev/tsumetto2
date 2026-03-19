
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
        const missionUnsub = useMissionStore.subscribe(state => {
            if (isInitializing) return
            debounce(async () => await missionRepo.replaceAll(state.missions), 1000)()
        })
        const learningUnsub = useLearningEventStore.subscribe(state => {
            if (isInitializing) return
            debounce(async () => await learningRepo.replaceAll(state.eventLog), 1000)()
        })
        const problemUnsub = useProblemStore.subscribe(state => {
            if (isInitializing) return
            debounce(async () => await problemRepo.replaceAll(Object.values(state.byId)), 1000)()
        })

        // 初期化完了
        isInitializing = false

        // bootstrap 本体
        const bootstrap = async () => {
            await initializeAppUsecase(missionRepo)
            await useMissionStore.getState().loadMissions()
            await useProblemStore.getState().reload()
            await useLearningEventStore.getState().reload()
        }
        bootstrap()

        // クリーンアップ
        return () => {
            missionUnsub()
            learningUnsub()
            problemUnsub()
        }
    }, [repos])
    
}