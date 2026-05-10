import { routes } from "@/ui/App/useAppNavigation"
import type { GlobalDialogControllers } from "@/ui/common/components/layout/AppShell"
import { DrawerMenu, type DrawerCommand, type DrawerMenuItem } from "@/ui/common/components/layout/DrawerMenu"
import { useNavigate } from "react-router-dom"

type DrawerCommandDeps = {
    navigate: (to: string) => void
    dialogs: {
        import: {
            openDialog(): void
        }
        backupRestore: {
            openDialog(): void
        }
    }
}
////////////////////////////////
export function AppDrawerMenu({ open, onClose, dialogs }: {
    open: boolean
    onClose: () => void
    dialogs: GlobalDialogControllers
}) {
    const navigate = useNavigate()
    const deps = {
        navigate,
        dialogs: {
            "import": {
                openDialog: dialogs.import.openFilesSelectDialog
            },
            "backupRestore": {
                openDialog: dialogs.backupRestore.openDialog
            }
        }
    }
    const handleDrawerCommand = (cmd: DrawerCommand) => {
        executeDrawerCommand(cmd, deps)
    }
    const menuItems: DrawerMenuItem[] = [
        { type: "item", label: "ミッション", command: { type: "NAVIGATE", to: routes.mission }, },
        { type: "item", label: "ライブラリ", command: { type: "NAVIGATE", to: routes.library } },
        { type: "item", label: "統計", command: { type: "NAVIGATE", to: routes.stats } },
        { type: "item", label: "履歴", command: { type: "NAVIGATE", to: routes.history } },
        { type: "divider" },
        { type: "item", label: "棋譜の取り込み", command: { type: "OPEN_DIALOG", dialog: "import" }, },
        { type: "item", label: "バックアップ・復旧", command: { type: "OPEN_DIALOG", dialog: "backupRestore" } },
        { type: "item", label: "設定", command: { type: "NAVIGATE", to: routes.settings}},
    ]

    return <DrawerMenu
        open={open}
        onClose={onClose}
        menuItems={menuItems}
        onCommand={(cmd) => { handleDrawerCommand(cmd); onClose() }}
    />
}

function executeDrawerCommand(command: DrawerCommand, deps: DrawerCommandDeps) {
    switch (command.type) {
        case "NAVIGATE":
            deps.navigate(command.to)
            break
        case "OPEN_DIALOG":
            deps.dialogs[command.dialog].openDialog()
            break;
        default:
            break
    }
    
}
