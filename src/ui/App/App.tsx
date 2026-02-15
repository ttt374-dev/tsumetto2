import './App.css'

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MissionScreen } from '../mission/MissionScreen';
import { LibraryScreen } from '../library/LibraryScreen';
import { MissionEventStoreProvider } from './providers/MissionEventStoreProvider';
//import { DashboardScreen } from '../dashboard/DashboardScreen';
import { MissionSummaryScreen } from '../summary/MissionSummaryScreen';
import DecksScreen from '../decks/DecksScreen';
import { DeckEditScreen } from '../decks/DeckEditScreen';
import { initProblemStore, useProblemStore } from '@/application/store/useProblemStore';
import { FileProblemPersistence, ProblemRepository } from '@/domain/problem/ProblemRepository';
import { DeckRepository, LocalStorageDeckPersistence } from '@/domain/deck/DeckRepository';
import { initDeckStore, useDeckStore } from '@/application/store/useDeckStore';
import { JsonLearningEventPersistence, LearningEventRepository } from '@/domain/LearningEvent/LearningEventRepository';
import { getInputLabelUtilityClasses } from '@mui/material';
import { initLearningEventRepository, useLearningEventStore } from '@/application/store/useLearningEventStore';
import { useEffect } from 'react';
import { MissionPlayerScreen } from '../mission/MissionPlayerScreen';
import { ViewerScreen } from '../viewer/ViewerScreen';
import { RepositoryContext } from './providers/RepositoryProvider';
import { LibraryQueryProvider } from './providers/QueryProvider';
import { ToastProvider } from './providers/ToastProvider';

function App() {
    // シングルトンレポジトリの生成
    const problemRepository = new ProblemRepository(new FileProblemPersistence())
    initProblemStore(problemRepository)
    useProblemStore.getState().reload()

    const deckRepository = new DeckRepository(new LocalStorageDeckPersistence())
    initDeckStore(deckRepository)
    useDeckStore.getState().loadDecks()

    const learningEventRepository = new LearningEventRepository(new JsonLearningEventPersistence())
    initLearningEventRepository(learningEventRepository)
    useLearningEventStore.getState().reload()

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

                            <Route path="/" element={<Navigate to="/decks" />} />
                        </Routes>
                    </BrowserRouter>
                </RepositoryContext.Provider>
            </LibraryQueryProvider>
        </ToastProvider >
    )
}

export default App
