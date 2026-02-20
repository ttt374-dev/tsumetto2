import type { ProblemId } from "@/domain/problem/Problem";
import { AppShell } from "../common/layout/AppShell";
import { ListView } from "./ListView";
import { useLocation } from "react-router-dom";

type ViewerLocationState = {
    title: string
  ids: string[]
}

export function ListScreen(){

    const location = useLocation()
    const state = (location.state as ViewerLocationState | null)
    const ids = state?.ids ?? []
    const title = state?.title ?? "List"


    return (
        <AppShell header={ title }>
            <ListView ids={ids} />            
        </AppShell>
    )
}