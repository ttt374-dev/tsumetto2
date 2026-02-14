import { useEffect } from "react";
//import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { Outlet, useNavigate } from "react-router-dom";
import { useMissionPlayerStore } from "../player/hooks/useMissionPlayerStore";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";

export function MissionScreen() {
    const missionEventStore = useMissionEventStoreContext()
    const phase = missionEventStore.snapshot?.phase ?? "idle"
    //const phase = useMissionPlayerStore(s=>s.snapshot)
    const navigate = useNavigate()

    useEffect(() => {
        switch (phase) {
            //case "idle":
            //    navigate("/mission", { replace: true })
            //    break
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
