import type { MenuCommand, MenuCommandDeps } from "@/application/navigation/types";


export function executeMenuCommand(command: MenuCommand, deps: MenuCommandDeps) {
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
