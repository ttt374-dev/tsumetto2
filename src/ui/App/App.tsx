import './App.css'

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AllProviders } from './providers/AllProviders';
import { MissionScreen } from '../mission/MissionScreen';
import { LibraryScreen } from '../library/LibraryScreen';
import { MissionEventStoreProvider } from './providers/MissionEventStoreProvider';
import { DashboardScreen } from '../dashboard/DashboardScreen';
import { PlayerScreen } from '../player/PlayerScreen';
import { SummaryScreen } from '../summary/SummaryScreen';
import DecksScreen from '../decks/DecksScreen';

function App() {
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
              <Route index element={<DashboardScreen />} />
              <Route path="play" element={<PlayerScreen />} />
              <Route path="summary" element={<SummaryScreen />} />
            </Route>

            <Route path="/decks" element={<DecksScreen />} />
          </Route>

          <Route path="/library" element={<LibraryScreen />} />

          <Route path="/" element={<Navigate to="/mission" />} />
        </Routes>
      </BrowserRouter>
    </AllProviders>
  )
}

export default App
