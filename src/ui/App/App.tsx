import './App.css'

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AllProviders } from './providers/AllProviders';
import { MissionScreen } from '../mission/MissionScreen';
import { LibraryScreen } from '../library/LibraryScreen';
import { MissionEventStoreProvider } from './providers/MissionEventStoreProvider';
//import { DashboardScreen } from '../dashboard/DashboardScreen';
import { MissionPlayerScreen, PlayerScreen } from '../player/PlayerScreen';
import { SummaryScreen } from '../summary/SummaryScreen';
import DecksScreen from '../decks/DecksScreen';
import { DeckEditScreen } from '../decks/DeckEditScreen';
import { initProblemStore, useProblemStore } from '@/application/store/useProblemStore';
import { FileProblemPersistence, ProblemRepository } from '@/domain/problem/ProblemRepository';
import { DeckRepository, LocalStorageDeckPersistence } from '@/domain/deck/DeckRepository';
import { initDeckStore, useDeckStore } from '@/application/store/useDeckStore';
import { JsonLearningEventPersistence, LearningEventRepository } from '@/domain/LearningEvent/LearningEventRepository';
import { getInputLabelUtilityClasses } from '@mui/material';
import { useLearningEventStore } from '@/application/store/useLearningEventStore';
import { useEffect } from 'react';

function App() {

    const problemRepository = new ProblemRepository(new FileProblemPersistence())
    initProblemStore(problemRepository)
    useProblemStore.getState().reload()

    const deckRepository = new DeckRepository(new LocalStorageDeckPersistence())
    initDeckStore(deckRepository)
    useDeckStore.getState().loadDecks()

    
    const initRepo = useLearningEventStore(s => s.initLearningEventRepository);   
    
    useEffect(()=> {
        const learningEventRepository = new LearningEventRepository(new JsonLearningEventPersistence())
        initRepo(learningEventRepository);
        // 初期ロード
        useLearningEventStore.getState().reload();
    }, [])

    return (
        <AllProviders>
            <BrowserRouter>
                <Routes>

                    <Route
                        element={
                            <MissionEventStoreProvider>
                                <Outlet />
                            </MissionEventStoreProvider>
                        }
                    >
                        <Route path="/mission" element={<MissionScreen />}>
                            <Route path="play" element={<MissionPlayerScreen />} />
                            <Route path="summary" element={<SummaryScreen />} />
                        </Route>

                        <Route path="/decks" element={<DecksScreen />} />
                        <Route path="/deck/:id" element={<DeckEditScreen />} />
                    </Route>

                    <Route path="/library" element={<LibraryScreen />} />

                    <Route path="/" element={<Navigate to="/decks" />} />
                </Routes>
            </BrowserRouter>
        </AllProviders>
    )
}

export default App
