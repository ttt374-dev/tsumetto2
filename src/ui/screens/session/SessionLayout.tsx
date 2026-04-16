import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { routes } from "@/ui/App/useAppNavigation";
import { useSessionStore } from "./hooks/useSessionStore";

export default function SessionLayout() {
    const phase = useSessionStore(s => s.phase())
    //console.log("phase", phase)
    const navigate = useNavigate()
    useEffect(() => {
        switch (phase) {
            case "idle":
                navigate(routes.mission, { replace: true})
                //<Navigate to={routes.mission} />
                break;
            case "playing":
                navigate(routes.sessionPlay, { replace: true})
                //<Navigate to={routes.sessionPlay} />
                break
            case "finished":
                navigate(routes.sessionSummary, { replace: true})
                //<Navigate to={routes.sessionSummary} />
                break
        }

    }, [phase])

    return <Outlet />
}
