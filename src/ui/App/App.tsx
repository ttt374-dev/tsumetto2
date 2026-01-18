import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryScreen } from '../library/LibraryScreen';
import { RepositoryProvider } from './providers/RepositoryProvider';
import { FsmProvider } from './providers/fsmProvider';
import { ToastProvider } from './providers/ToastProvider';
import { MissionScreen } from '../mission/MissionScreen';

function App() {
    return (
        <RepositoryProvider>

            <FsmProvider>
                <ToastProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/mission" element={<MissionScreen />} />
                            <Route path="/library" element={<LibraryScreen />} />
                            <Route path="/" element={<Navigate to="/mission"/>}/>

                        </Routes>
                    </BrowserRouter>
                </ToastProvider>
            </FsmProvider>

        </RepositoryProvider>
    )
}

export default App
