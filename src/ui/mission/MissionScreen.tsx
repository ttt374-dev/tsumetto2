import { useEffect } from "react";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { DashboardScreen } from "../dashboard/DashboardScreen";
import { PlayerScreen } from "../player/PlayerScreen";
import { SummaryScreen } from "../summary/SummaryScreen";
import { Outlet, useNavigate } from "react-router-dom";

export function MissionScreen() {
    const missionStore = useMissionEventStoreContext()
    const phase = missionStore.snapshot?.phase ?? "idle"
    const navigate = useNavigate()

    useEffect(() => {
        switch (phase) {
            case "idle":
                navigate("/mission", { replace: true })
                break
            case "playing":
                navigate("/mission/play", { replace: true })
                break
            case "finished":
                navigate("/mission/summary", { replace: true })
                break
        }
    }, [phase])

    return <Outlet />
}
