import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSessionStore as useSessionStore } from "@/ui/store/useSessionStore";
import { routes } from "../App/useAppNavigation";

export function SessionScreen() {    
    const phase = useSessionStore(s=>s.phase())
    const navigate = useNavigate()

    useEffect(() => {
        switch (phase) {
            case "idle":
                navigate(routes.decks)
                break;
            case "playing":
                navigate(routes.sessionPlay) // , { replace: true })
                break
            case "finished":
                navigate(routes.sessionSummary) // , { replace: true })
                break
        }
    }, [phase])

    return <Outlet />
}
