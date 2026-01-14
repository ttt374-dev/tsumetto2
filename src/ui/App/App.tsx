import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryScreen } from '../library/LibraryScreen';
import { RepositoryProvider } from './providers/RepositoryProvider';
import { StoreProvider } from './providers/StoreProvider';
import { DashboardScreen } from '../dashboard/DashboardScreen';
import { FsmProvider } from './providers/fsmProvider';
import { PlayerScreen } from '../player/PlayerScreen';
import { SummaryScreen } from '../summary/SummaryScreen';
import { ToastProvider } from './providers/ToastProvider';
import './App.css'

function App() {
    return (
        <RepositoryProvider>

            <FsmProvider>
                <ToastProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/player" element={<PlayerScreen />} />
                            <Route path="/dashboard" element={<DashboardScreen />} />
                            <Route path="/library" element={<LibraryScreen />} />
                            <Route path="/summary" element={<SummaryScreen />} />
                            <Route path="/" element={<Navigate to="/dashboard"/>}/>

                        </Routes>
                    </BrowserRouter>
                </ToastProvider>
            </FsmProvider>

        </RepositoryProvider>
    )
}

export default App
