import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryScreen } from '../library/LibraryScreen';
import { RepositoryProvider } from './providers/RepositoryProvider';
import { StoreProvider } from './providers/StoreProvider';
import { DashboardScreen } from '../dashboard/DashboardScreen';
import { FsmProvider } from './providers/fsmPRovider';
import { PlayerScreen } from '../player/PlayerScreen';

function App() {
    return (
        <RepositoryProvider>
            <StoreProvider>
                <FsmProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/player" element={<PlayerScreen />} />
                            <Route path="/dashboard" element={<DashboardScreen />} />
                            <Route path="/library" element={<LibraryScreen />} />
                        </Routes>
                    </BrowserRouter>
                </FsmProvider>
            </StoreProvider>
        </RepositoryProvider>
    )
}

export default App
