import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AllProviders } from './providers/AllProviders';
import { MissionScreen } from '../mission/MissionScreen';
import { LibraryScreen } from '../library/LibraryScreen';
import { ViewSCreen } from '../view/ViewScreen';

function App() {
    return (
        <AllProviders>
            <BrowserRouter>
                <Routes>
                    <Route path="/mission" element={<MissionScreen />} />
                    <Route path="/library" element={<LibraryScreen />} />
                    <Route path="/view/:id" element={<ViewSCreen />} />
                    <Route path="/" element={<Navigate to="/mission" />} />
                </Routes>
            </BrowserRouter>
        </AllProviders>
    )
}

export default App
