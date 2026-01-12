import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryScreen } from '../library/LibraryScreen';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/library" element={<LibraryScreen />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
