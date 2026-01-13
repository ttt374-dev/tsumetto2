import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryScreen } from '../library/LibraryScreen';
import { RepositoryProvider } from './providers/RepositoryProvider';
import { StoreProvider } from './providers/StoreProvider';
import { DashboardScreen } from '../dashboard/DashboardScreen';
import { FsmProvider } from './providers/fsmPRovider';
import { PlayerScreen } from '../player/PlayerScreen';
import { SummaryScreen } from '../summary/SummaryScreen';
import { ToastProvider } from './providers/ToastProvider';

function App() {
    return (
        <RepositoryProvider>
            <StoreProvider>
                <FsmProvider>
                    <ToastProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/player" element={<PlayerScreen />} />
                            <Route path="/dashboard" element={<DashboardScreen />} />
                            <Route path="/library" element={<LibraryScreen />} />
                            <Route path="/summary" element={<SummaryScreen />} />
                        </Routes>
                    </BrowserRouter>
                    </ToastProvider>
                </FsmProvider>
            </StoreProvider>
        </RepositoryProvider>
    )
}

export default App
