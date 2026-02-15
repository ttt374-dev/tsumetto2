import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useMissionStore } from "@/application/store/useMissionStore";

export function MissionScreen() {    
    const phase = useMissionStore(s=>s.phase())
    const navigate = useNavigate()

    useEffect(() => {
        console.log("phase", phase)
        switch (phase) {
            case "idle":
                navigate("/decks")
                break;
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
