import './App.css'

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { MissionScreen } from '../mission/MissionScreen';
import { LibraryScreen } from '../library/LibraryScreen';
import { MissionSummaryScreen } from '../summary/MissionSummaryScreen';
import DecksScreen from '../decks/DecksScreen';
import { DeckEditScreen } from '../decks/DeckEditScreen';
import { initProblemStore, useProblemStore } from '@/ui/store/useProblemStore';
import { DeckRepository, LocalStorageDeckPersistence } from '@/domain/deck/repository/DeckRepository';
import { initDeckStore, useDeckStore } from '@/ui/store/useDeckStore';
import { LocalStorageLearningEventPersistence, LearningEventRepository } from '@/domain/learning/repository/LearningEventRepository';
import { initLearningEventRepository, useLearningEventStore } from '@/ui/store/useLearningEventStore';
import { MissionPlayerScreen } from '../mission/MissionPlayerScreen';
import { ViewerScreen } from '../viewer/ViewerScreen';
import { RepositoryContext } from './providers/RepositoryProvider';
import { ToastProvider } from './providers/ToastProvider';
import { ListScreen } from '../list/ListScreen';
import { LocalStrorageProblemPersistence, ProblemRepository } from '@/domain/problem/repository/ProblemRepository';

function App() {
    // シングルトンレポジトリの生成
    const repos = {
        problem: new ProblemRepository(new LocalStrorageProblemPersistence()),
        learningEvent: new LearningEventRepository(new LocalStorageLearningEventPersistence()),
        deck: new DeckRepository(new LocalStorageDeckPersistence()),
    }
    initProblemStore(repos.problem)
    initLearningEventRepository(repos.learningEvent)
    initDeckStore(repos.deck)

    useProblemStore.getState().reload()
    useDeckStore.getState().loadDecks()
    useLearningEventStore.getState().reload()

    // hydrate
    const hydrate = useProblemStore(s => s.reload)

    useEffect(() => {
        hydrate()
    }, [])

    return (
        <ToastProvider>

            <RepositoryContext.Provider value={{
                problem: repos.problem,
                learningEvent: repos.learningEvent,
                deck: repos.deck,

            }}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/mission" element={<MissionScreen />}>
                            <Route path="play" element={<MissionPlayerScreen />} />
                            <Route path="summary" element={<MissionSummaryScreen />} />
                        </Route>

                        <Route path="/decks" element={<DecksScreen />} />
                        <Route path="/deck/:id" element={<DeckEditScreen />} />

                        <Route path="/library" element={<LibraryScreen />} />
                        <Route path="/view/:id" element={<ViewerScreen />} />
                        <Route path="/list" element={<ListScreen />} />

                        <Route path="/" element={<Navigate to="/decks" />} />
                    </Routes>
                </BrowserRouter>
            </RepositoryContext.Provider>

        </ToastProvider >
    )
}

export default App
