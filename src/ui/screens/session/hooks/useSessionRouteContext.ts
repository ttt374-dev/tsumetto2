import { parseSessionParams, type ParseSessionParamsResult } from "@/ui/screens/session/vm/parseSessionParams"
import { useParams } from "react-router-dom"

//export type SessionRouteContext = ReturnType<typeof useSessionRouteContext>
export type SessionRouteContext = {
   result: ParseSessionParamsResult
   sessionId: string
   index: number
}

export function useSessionRouteContext(){
    const params = useParams<{ sessionId: string, index: string }>()
    const result = parseSessionParams(params)

    const sessionId = result.type === "valid" ? result.sessionId : ""
    const index = result.type === "valid" ? result.index : -1

    return { result, sessionId, index}
}