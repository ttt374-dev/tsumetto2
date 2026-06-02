export type MenuItem ={ 
    label: string
    icon: React.ReactNode
    command: MenuCommand 
    group: MenuGroup
    footNav?: boolean
}
    //| { type: "divider" }

export type MenuCommand = 
    | { type: "NAVIGATE", to: string }
    | { type: "OPEN_DIALOG", dialog: "import" | "backupRestore" }

/*export type DrawerMenuGroup =
    | "main"
    | "analysis"
    | "maintenance"
    | "settings"
    */
export const menuGroups = ["main", "analysis", "maintenance", "settings"]
export type MenuGroup = typeof menuGroups[number]

export type MenuCommandDeps = {
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