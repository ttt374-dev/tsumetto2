import './App.css'
import { App as CapacitorApp } from '@capacitor/app';
import { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation, useNavigationType } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material";

import MissionScreen from '@/ui/screens/mission/MissionScreen.tsx';
import MissionEditScreen from '@/ui/screens/mission/edit/MissionEditScreen.tsx';
import { RepositoryContext, type RepositoryContextValue } from './providers/RepositoryProvider';
import { ToastProvider } from './providers/ToastProvider';
import { ListScreen } from '@/ui/dialogs/list/ListScreen.tsx';
import StatsScreen from '@/ui/screens/stats/StatsScreen.tsx';
import { routePaths } from '../../router/paths';
import SessionSummaryScreen from '@/ui/screens/summary/SessionSummaryScreen.tsx';
import ProblemDetailScreen from '@/ui/screens/detail/ProblemDetailScreen.tsx';
import LibraryScreen from '@/ui/screens/library/LibraryScreen.tsx';
import SessionPlayerScreen from '@/ui/screens/session/SessionPlayerScreen.tsx';
import HistoryScreen from '@/ui/screens/history/HistoryScreen.tsx';
import SinglePlayerScreen from '@/ui/screens/player/SinglePlayerScreen';
import ViewScreen from '@/ui/screens/view/ViewScreen';
import SessionListScreen from '@/ui/screens/session/components/SessionListScreen';
import { SettingsScreen } from '@/ui/screens/settings/SettingsScreen';
import { useBootstrapStores } from '@/ui/App/useBootstrapStores';
import { MaintenanceScreen } from '@/ui/maintenance/MaintenanceScreen';

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
                    bottom: `calc(48px + env(safe-area-inset-bottom))`
                }
            }
        }
    },
});
function App(props: { repos: RepositoryContextValue }) {
    const { repos } = props
    useBootstrapStores(repos)
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
                    reviewEvent: repos.reviewEvent,
                    mission: repos.mission,
                }}>
                    <BrowserRouter>
                        { /* <DebugHistory />                         */}
                        <Routes>
                            <Route path={routePaths.sessionPlay.path} element={<SessionPlayerScreen />} />
                            <Route path={routePaths.sessionSummary.path} element={<SessionSummaryScreen />} />
                            <Route path={routePaths.sessionList.path} element={<SessionListScreen />} />

                            <Route path={routePaths.mission} element={<MissionScreen />} />
                            <Route path={routePaths.missionEdit.path} element={<MissionEditScreen />} />

                            <Route path={routePaths.library} element={<LibraryScreen />} />
                            { /* <Route path="/view/:id" element={<ViewerScreen />} /> */}
                            <Route path={routePaths.player.path} element={<SinglePlayerScreen />} />
                            <Route path={routePaths.list} element={<ListScreen />} />
                            <Route path={routePaths.detail.path} element={<ProblemDetailScreen />} />
                            { /* <Route path="/view/:id" element={<ViewScreen />} />*/ }

                            <Route path={routePaths.stats} element={<StatsScreen />} />
                            <Route path={routePaths.history} element={<HistoryScreen />} />
                            <Route path={routePaths.settings} element={<SettingsScreen />} />
                            <Route path={routePaths.maintenance} element={<MaintenanceScreen />} />
                            <Route path="/" element={<Navigate to={routePaths.mission} />} />
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