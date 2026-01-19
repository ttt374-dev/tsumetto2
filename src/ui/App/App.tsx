import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AllProviders } from './providers/AllProviders';
import { MissionScreen } from '../mission/MissionScreen';
import { LibraryScreen } from '../library/LibraryScreen';

function App() {
    return (
        <AllProviders>
            <BrowserRouter>
                <Routes>
                    <Route path="/mission" element={<MissionScreen />} />
                    <Route path="/library" element={<LibraryScreen />} />
                    <Route path="/" element={<Navigate to="/mission" />} />
                </Routes>
            </BrowserRouter>
        </AllProviders>
    )
}

export default App
