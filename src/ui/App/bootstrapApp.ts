
import { useEffect, useMemo } from 'react';
import { useProblemStore } from '@/ui/store/useProblemStore';
import { DeckRepository, LocalStorageDeckPersistence } from '@/domain/deck/repository/DeckRepository';
import { useDeckStore } from '@/ui/store/useDeckStore';
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
        deck: new DeckRepository(new LocalStorageDeckPersistence()),
    }
}
export function bootstrapApp(repos: RepositoryContextValue) {
    useEffect(() => {
        const deckRepo = repos.deck
        const learningRepo = repos.learningEvent
        const problemRepo = repos.problem

        // Repository 注入
        useDeckStore.getState().setRepository(deckRepo)
        useLearningEventStore.getState().setRepository(learningRepo)
        useProblemStore.getState().setRepository(problemRepo)

        // 初期化フラグ
        let isInitializing = true

        // subscribe 設定
        const deckUnsub = useDeckStore.subscribe(state => {
            if (isInitializing) return
            debounce(async () => await deckRepo.replaceAll(state.decks), 1000)()
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
            await initializeAppUsecase(deckRepo)
            await useDeckStore.getState().loadDecks()
            await useProblemStore.getState().reload()
            await useLearningEventStore.getState().reload()
        }
        bootstrap()

        // クリーンアップ
        return () => {
            deckUnsub()
            learningUnsub()
            problemUnsub()
        }
    }, [repos])
    
}