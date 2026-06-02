/*import { createMenuDeps } from "@/application/navigation/createMenuDeps"
import { executeMenuCommand } from "@/application/navigation/executeMenuCommand"
import { menuItems } from "@/application/navigation/menuItems"
import type { MenuCommand, MenuCommandDeps } from "@/application/navigation/types"
import type { GlobalDialogControllers } from "@/ui/common/components/layout/AppShell"
import { DrawerMenu } from "@/ui/common/components/layout/DrawerMenu"

////////////////////////////////
export function AppDrawerMenu({ open, onClose, dialogs }: {
    open: boolean
    onClose: () => void
    dialogs: GlobalDialogControllers
}) {
    
    const handleDrawerCommand = (cmd: MenuCommand) => {
        onClose()
        executeMenuCommand(cmd, createMenuDeps(dialogs))
    }
    return <DrawerMenu
        open={open}
        onClose={onClose}
        menuItems={menuItems}
        onCommand={handleDrawerCommand}
    />
}
*/