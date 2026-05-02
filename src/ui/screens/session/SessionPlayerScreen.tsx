import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel"
import { AppShell } from "@/ui/common/components/layout/AppShell"
import { useSessionPlayerViewModel } from "@/ui/screens/session/hooks/useSessionPlayerViewModel"
import { useSessionPlayerValidation } from "@/ui/screens/session/hooks/useSessionPlayerValidation"

export default function SessionPlayerScreen() {
    const res = useSessionPlayerValidation()
    if (res.type === "error") return <AppShell>{ res.message}</AppShell>    

    const vm = useSessionPlayerViewModel(res.problem, res.sessionId, res.currentIndex)
    return (
        <PlayerScreen
            problem={res.problem}
            title={vm.title}
            onUIEvent={vm.handleUIEvent}
            footerPanel={
                <PlayerFooterPanel
                    onNext={vm.goNext}
                    onShowList={vm.goList} />
            }
        />

    )
}
