import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMissionStore } from "@/ui/store/useMissionStore";
import { routes } from "../App/useAppNavigation";

export function MissionScreen() {    
    const phase = useMissionStore(s=>s.phase())
    const navigate = useNavigate()

    useEffect(() => {
        switch (phase) {
            case "idle":
                //navigate("/decks")
                navigate(routes.decks)
                break;
            //    navigate("/mission", { replace: true })
            //    break
            case "playing":
                //navigate("/mission/play", { replace: true })
                navigate(routes.missionPlay, { replace: true })
                break
            case "finished":
                //navigate("/mission/summary", { replace: true })
                navigate(routes.missionSummary, { replace: true })
                break
        }
    }, [phase])

    return <Outlet />
}
