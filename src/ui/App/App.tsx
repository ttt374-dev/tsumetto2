import './App.css'
import { App as CapacitorApp } from '@capacitor/app';
import { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useLocation, useNavigationType } from "react-router-dom";
import { CssBaseline, CssVarsProvider, useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material";

import { SessionLayout } from '../session/SessionLayout.tsx';
import { LibraryScreen } from '../library/LibraryScreen';
import MissionScreen from '../decks/MissionScreen.tsx';
import { MissionEditScreen } from '../decks/MissionEditScreen.tsx';
import { SessionPlayerScreen } from '../session/SessionPlayerScreen';
import { ViewerScreen } from '../viewer/ViewerScreen';
import { RepositoryContext, type RepositoryContextValue } from './providers/RepositoryProvider';
import { ToastProvider } from './providers/ToastProvider';
import { ListScreen } from '../list/ListScreen';
import { StatsScreen } from '../stats/StatsScreen';
import { SinglePlayerScreen } from '../player/SinglePlayerScreen';
import { bootstrapApp, createRepositories } from './bootstrapApp';
import { routes } from './useAppNavigation';
import { SessionSummaryScreen } from '../summary/MissionSummaryScreen.tsx';
import { ProblemDetailScreen } from '../detail/ProblemDetailScreen.tsx';

export const theme = createTheme({
    cssVariables: true,   // ← これ必須
    colorSchemes: {
        light: {
            palette: {
                board: {
                    bg: "#f8f4e6",
                    grid: "#aaa",
                },
            },
        },
        dark: {
            palette: {
                board: {
                    bg: "#5e4b3c",
                    grid: "#888",
                },
            },
        },
    },
    components: {
        MuiSnackbar: {
            styleOverrides: {
                root: {
                    bottom: `calc(16px + env(safe-area-inset-bottom))`
                }
            }
        }
    },
});
function App() {
    const repos = useMemo(() => createRepositories(), [])
    bootstrapApp(repos)
    //useAndroidBack(); // 最上位で呼ぶ

    return (
        <ThemeProvider
            theme={theme}
            defaultMode="system"
        >
            <CssBaseline />
            <ToastProvider>
                <RepositoryContext.Provider value={{
                    problem: repos.problem,
                    learningEvent: repos.learningEvent,
                    mission: repos.mission,

                }}>
                    <BrowserRouter>
                        { /* <DebugHistory /> */ }
                        <Routes>

                            <Route path={routes.session} element={<SessionLayout />}>
                                <Route path="play" element={<SessionPlayerScreen />} />
                                <Route path="summary" element={<SessionSummaryScreen />} />
                            </Route>

                            <Route path={routes.mission} element={<MissionScreen />} />
                            <Route path={`${routes.mission}/:id`} element={<MissionEditScreen />} />

                            <Route path={routes.library} element={<LibraryScreen />} />
                            { /* <Route path="/view/:id" element={<ViewerScreen />} /> */ }
                            <Route path="/play/:id" element={<SinglePlayerScreen />} />
                            <Route path="/list" element={<ListScreen />} />
                            <Route path="/detail/:id" element={<ProblemDetailScreen/>}/>

                            <Route path={routes.stats} element={<StatsScreen />} />

                            <Route path="/" element={<Navigate to={routes.mission} />} />
                        </Routes>
                    </BrowserRouter>
                </RepositoryContext.Provider>

            </ToastProvider >
        </ThemeProvider>
    )
}

export default App


///////////

export function useAndroidBack() {
    useEffect(() => {
        const handlerPromise = CapacitorApp.addListener("backButton", (event: { canGoBack: boolean }) => {
            console.log("back button listner", event.canGoBack)
            if (event.canGoBack) {
                window.history.back();
            } else {
                CapacitorApp.exitApp(); // Capacitor が提供するアプリ終了
            }
        });

        return () => {
            handlerPromise.then(handler => handler.remove());
        };
    }, []);
}

function DebugHistory() {
    const location = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
        console.log("PATH:", location.pathname);
        console.log("KEY:", location.key);
        console.log("NAV TYPE:", navType);
        console.log("HISTORY LENGTH:", window.history.length);
        console.log("HISTORY STATE:", window.history.state);
    }, [location]);

    return null;
}