import { AppShell } from "@/ui/common/components/layout/AppShell"
import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel"
import { useSessionPlayerRunner } from "@/ui/screens/session/hooks/useSessionPlayerRunner"

export default function SessionPlayerScreen() {
    const vm = useSessionPlayerRunner()
    if (vm.type === "error") return <AppShell>Error: { vm.message}</AppShell>

    //const title = vm.problem.title
    return (
        <PlayerScreen
            problem={vm.problem}
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

