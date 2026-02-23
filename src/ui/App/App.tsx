import './App.css'

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MissionScreen } from '../mission/MissionScreen';
import { LibraryScreen } from '../library/LibraryScreen';
import { MissionSummaryScreen } from '../summary/MissionSummaryScreen';
import DecksScreen from '../decks/DecksScreen';
import { DeckEditScreen } from '../decks/DeckEditScreen';
import { initProblemStore, useProblemStore } from '@/ui/store/useProblemStore';
import { LocalStrorageProblemPersistence, ProblemRepository } from '@/domain/problem/ProblemRepository';
import { DeckRepository, LocalStorageDeckPersistence } from '@/domain/deck/repository/DeckRepository';
import { initDeckStore, useDeckStore } from '@/ui/store/useDeckStore';
import { LocalStorageLearningEventPersistence, LearningEventRepository } from '@/domain/learning/repository/LearningEventRepository';
import { initLearningEventRepository, useLearningEventStore } from '@/ui/store/useLearningEventStore';
import { MissionPlayerScreen } from '../mission/MissionPlayerScreen';
import { ViewerScreen } from '../viewer/ViewerScreen';
import { RepositoryContext } from './providers/RepositoryProvider';
import { LibraryQueryProvider } from './providers/QueryProvider';
import { ToastProvider } from './providers/ToastProvider';
import { useEffect } from 'react';
import { ListScreen } from '../list/ListScreen';

function App() {
    // シングルトンレポジトリの生成
    const problemRepository = new ProblemRepository(new LocalStrorageProblemPersistence())
    initProblemStore(problemRepository)
    useProblemStore.getState().reload()

    const deckRepository = new DeckRepository(new LocalStorageDeckPersistence())
    initDeckStore(deckRepository)
    useDeckStore.getState().loadDecks()

    const learningEventRepository = new LearningEventRepository(new LocalStorageLearningEventPersistence())
    initLearningEventRepository(learningEventRepository)
    useLearningEventStore.getState().reload()

    // hydrate
    const hydrate = useProblemStore(s => s.reload)

    useEffect(() => {
        hydrate()
    }, [])

    return (
        <ToastProvider>
            <LibraryQueryProvider>
                <RepositoryContext.Provider value={{
                    problem: problemRepository,
                    deck: deckRepository,
                    learningEvent: learningEventRepository

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
            </LibraryQueryProvider>
        </ToastProvider >
    )
}

export default App
