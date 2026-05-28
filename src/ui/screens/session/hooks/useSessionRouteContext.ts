import { useParams } from "react-router-dom"

import { parseSessionParams } from "@/ui/screens/session/hooks/parseSessionParams"


export function useSessionRouteContext(){
    const params = useParams<{ sessionId: string, index: string }>()
    return parseSessionParams(params)
}