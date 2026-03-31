import { routes } from "@/ui/App/useAppNavigation";
import { useNavigate } from "react-router-dom";

export function useMissionCreator(){
    const navigate = useNavigate()

    const createMission = () => navigate(routes.newMission);

    return { createMission }
}
