import { Navigate, Outlet } from "react-router-dom";
import { routes } from "../App/useAppNavigation";
import { useSessionStore } from "../store/useSessionStore";

export function SessionLayout() {    
    const phase = useSessionStore(s => s.phase())
    switch (phase) {
        case "idle":
            <Navigate to={routes.mission} />
            break;
        case "playing":
            <Navigate to={routes.sessionPlay} />
            break
        case "finished":
            <Navigate to={routes.sessionSummary} />
            break
    }

    return <Outlet />
}
