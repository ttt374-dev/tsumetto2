import { Outlet, useNavigate } from "react-router-dom";
import { routes } from "../App/useAppNavigation";
import { useSessionStore } from "./hooks/useSessionStore";
import { useEffect } from "react";

export default function SessionLayout() {
    const phase = useSessionStore(s => s.phase())
    //console.log("phase", phase)
    const navigate = useNavigate()
    useEffect(() => {
        switch (phase) {
            case "idle":
                navigate(routes.mission)
                //<Navigate to={routes.mission} />
                break;
            case "playing":
                navigate(routes.sessionPlay)
                //<Navigate to={routes.sessionPlay} />
                break
            case "finished":
                navigate(routes.sessionSummary)
                //<Navigate to={routes.sessionSummary} />
                break
        }

    }, [phase])

    return <Outlet />
}
