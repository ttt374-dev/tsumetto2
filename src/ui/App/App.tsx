import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryScreen } from '../library/LibraryScreen';
import { RepositoryProvider } from './providers/RepositoryProvider';
import { StoreProvider } from './providers/StoreProvider';

function App() {
    return (
        <RepositoryProvider>
            <StoreProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/library" element={<LibraryScreen />} />
                    </Routes>
                </BrowserRouter>
            </StoreProvider>
        </RepositoryProvider>
    )
}

export default App
