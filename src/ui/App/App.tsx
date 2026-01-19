import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryScreen } from '../library/LibraryScreen';
import { RepositoryProvider } from './providers/RepositoryProvider';
import { ToastProvider } from './providers/ToastProvider';
import { MissionScreen } from '../mission/MissionScreen';
import { QueryProvider } from './providers/QueryProvider';

function App() {
    return (
        <RepositoryProvider>
            <ToastProvider>
                <QueryProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/mission" element={<MissionScreen />}/>
                            <Route path="/library" element={<LibraryScreen />} />
                            <Route path="/" element={<Navigate to="/mission" />} />
                        </Routes>
                    </BrowserRouter>
                </QueryProvider>
            </ToastProvider>
        </RepositoryProvider >
    )
}

export default App
