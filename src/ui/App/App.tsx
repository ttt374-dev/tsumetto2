import './App.css'
import { App as CapacitorApp } from '@capacitor/app';
import { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useLocation, useNavigationType } from "react-router-dom";

import { MissionScreen } from '../mission/MissionScreen';
import { LibraryScreen } from '../library/LibraryScreen';
import { MissionSummaryScreen } from '../summary/MissionSummaryScreen';
import DecksScreen from '../decks/DecksScreen';
import { DeckEditScreen } from '../decks/DeckEditScreen';
import { MissionPlayerScreen } from '../mission/MissionPlayerScreen';
import { ViewerScreen } from '../viewer/ViewerScreen';
import { RepositoryContext, type RepositoryContextValue } from './providers/RepositoryProvider';
import { ToastProvider } from './providers/ToastProvider';
import { ListScreen } from '../list/ListScreen';
import { StatsScreen } from '../stats/StatsScreen';
import { SinglePlayerScreen } from '../player/SinglePlayerScreen';
import { bootstrapApp, createRepositories } from './bootstrapApp';

export function useAndroidBack() {
  useEffect(() => {
    const handlerPromise = CapacitorApp.addListener("backButton", (event: { canGoBack: boolean }) => {
        console.log("back button listner", event.canGoBack)
      if (event.canGoBack) {
        window.history.back();
      } else {
        CapacitorApp.exitApp(); // Capacitor が提供するアプリ終了
      }
    });

    return () => {
      handlerPromise.then(handler => handler.remove());
    };
  }, []);
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
     useAndroidBack(); // 最上位で呼ぶ
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
