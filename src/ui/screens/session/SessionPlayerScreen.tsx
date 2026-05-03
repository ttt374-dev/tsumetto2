import { AppShell } from "@/ui/common/components/layout/AppShell"
import PlayerScreen from "@/ui/screens/player/PlayerScreen"

import { useSessionPlayerRunner } from "@/ui/screens/session/hooks/useSessionPlayerRunner"

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

