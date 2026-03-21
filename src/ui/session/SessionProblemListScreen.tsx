import type { ProblemId } from "@/domain/problem/entity/Problem"
import { routes } from "@/ui/App/useAppNavigation"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useSessionPlayerViewModel } from "@/ui/session/hooks/useSessionPlayerViewModel"
import { SessionListView } from "@/ui/session/SessionListView"
import { useNavigate } from "react-router-dom"


export default function SessionProblemListScreen() {
    const vm = useSessionPlayerViewModel()
    if (vm.status !== "playing") return <>{vm.status}</>
    if (!vm.sessionId) return <>NO SESSION ID</>
    const navigate = useNavigate()

    const handleOnSelect = (id: ProblemId) => {
        //navigate(routes.sessionList)
    }

    return (
        <AppShell 
            header={"セッション問題リスト"}
            navigateBack={true}>
            <SessionListView ids={vm.problemIds}
                onSelect={(id) => {
                    handleOnSelect(id)

                }}
                selectedId={vm.problem.id}
                sessionId={vm.sessionId}
            />
        </AppShell>
    )
}