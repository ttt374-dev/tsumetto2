import './App.css'
//import { App as CapacitorApp } from '@capacitor/app';
import { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useLocation, useNavigationType } from "react-router-dom";

import { MissionScreen } from '../mission/MissionScreen';
import { LibraryScreen } from '../library/LibraryScreen';
import { MissionSummaryScreen } from '../summary/MissionSummaryScreen';
import DecksScreen from '../decks/DecksScreen';
import { DeckEditScreen } from '../decks/DeckEditScreen';
import { useProblemStore } from '@/ui/store/useProblemStore';
import { DeckRepository, LocalStorageDeckPersistence } from '@/domain/deck/repository/DeckRepository';
import { useDeckStore } from '@/ui/store/useDeckStore';
import { LocalStorageLearningEventPersistence, LearningEventRepository } from '@/domain/learning/repository/LearningEventRepository';
import { useLearningEventStore } from '@/ui/store/useLearningEventStore';
import { MissionPlayerScreen } from '../mission/MissionPlayerScreen';
import { ViewerScreen } from '../viewer/ViewerScreen';
import { RepositoryContext, type RepositoryContextValue } from './providers/RepositoryProvider';
import { ToastProvider } from './providers/ToastProvider';
import { ListScreen } from '../list/ListScreen';
import { LocalStrorageProblemPersistence, ProblemRepository } from '@/domain/problem/repository/ProblemRepository';
import { initializeAppUsecase } from '@/application/usecase/initializeApp/useInitializeAppUsecase';
import { debounce } from 'lodash';
import { StatsScreen } from '../stats/StatsScreen';
import { SinglePlayerScreen } from '../player/SinglePlayerScreen';

function createRepositories() {
    return {
        problem: new ProblemRepository(new LocalStrorageProblemPersistence()),
        learningEvent: new LearningEventRepository(new LocalStorageLearningEventPersistence()),
        deck: new DeckRepository(new LocalStorageDeckPersistence()),
    }
}
function bootstrapApp(repos: RepositoryContextValue) {
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


function DebugHistory() {
  const location = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    console.log("PATH:", location.pathname);
    console.log("KEY:", location.key);
    console.log("NAV TYPE:", navType);
    console.log("HISTORY LENGTH:", window.history.length);
    console.log("HISTORY STATE:", window.history.state);
  }, [location]);

  return null;
}
function App() {
    const repos = useMemo(() => createRepositories(), [])
    bootstrapApp(repos)       
    
    return (
        <ToastProvider>

            <RepositoryContext.Provider value={{
                problem: repos.problem,
                learningEvent: repos.learningEvent,
                deck: repos.deck,

            }}>
                <BrowserRouter>
                <DebugHistory/>
                    <Routes>
                        
                        <Route path="/mission" element={<MissionScreen />}>
                            <Route path="play" element={<MissionPlayerScreen />} />
                            <Route path="summary" element={<MissionSummaryScreen />} />
                        </Route>

                        <Route path="/decks" element={<DecksScreen />} />
                        <Route path="/deck/:id" element={<DeckEditScreen />} />

                        <Route path="/library" element={<LibraryScreen />} />
                        <Route path="/view/:id" element={<ViewerScreen />} />
                        <Route path="/play/:id" element={<SinglePlayerScreen />} />
                        <Route path="/list" element={<ListScreen />} />

                        <Route path="/stats" element={<StatsScreen />} />

                        <Route path="/" element={<Navigate to="/decks" />} />
                    </Routes>
                </BrowserRouter>
            </RepositoryContext.Provider>

        </ToastProvider >
    )
}

export default App
