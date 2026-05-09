import { createContext, useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

import { routes } from "@/ui/App/useAppNavigation";
import { useImportController, type ImportController } from "@/ui/dialogs/Import/useImportController";
import { useBackupRestoreDialogController, type BackupRestoreController } from "@/ui/dialogs/BackupRestore/useBackupRestoreDIalogController";
import type { DrawerMenuItem } from "@/ui/common/components/layout/DrawerMenu";

export function useAppDrawerMenu(
    importController: ImportController,
    backupRestoreController: BackupRestoreController
 ) {
    const drawer = useDrawerState()
    const navigate = useNavigate()
    const menuItems: DrawerMenuItem[] = [
        { type: "item", label: "ミッション", action: () => navigate(routes.mission)},
        { type: "item", label: "ライブラリ", action: () => navigate(routes.library)},
        { type: "item", label: "統計", action: () => navigate(routes.stats) },
        { type: "item", label: "履歴", action: () => navigate(routes.history) },
        { type: "divider"},
        { type: "item", label: "棋譜の取り込み", action: importController.openFilesSelectDialog},
        { type: "item", label: "バックアップ・復旧", action: backupRestoreController.openDialog }
    ]

    return {
        ...drawer,
        menuItems,
    }
}
function useDrawerState(){
    const [open, setOpen] = useState(false)

    return {
        open, 
        openDrawer: () => setOpen(true),
        closeDrawer: () => setOpen(false),
    }
}