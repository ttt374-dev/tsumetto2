import { AppShell } from "@/ui/common/components/layout/AppShell"
import PlayerScreen from "@/ui/screens/player/PlayerScreen"
import { PlayerFooterPanel } from "@/ui/screens/player/components/panels/PlayerFooterPanel"
import type { PlayerIntent } from "@/ui/screens/player/hooks/usePlayerViewModel"
import { useSessionPlayerRunner } from "@/ui/screens/session/hooks/useSessionPlayerRunner"
import type { SessionCommand } from "@/ui/screens/session/vm/resolveSessionCommand"

export default function SessionPlayerScreen() {
    const vm = useSessionPlayerRunner()
    if (vm.type === "error") return <AppShell>Error: {vm.message}</AppShell>
    return (
        <PlayerScreen
            problem={vm.problem}
            title={vm.title}
            onPlayerIntent={vm.handlePlayerIntent}
        />

    )
}

