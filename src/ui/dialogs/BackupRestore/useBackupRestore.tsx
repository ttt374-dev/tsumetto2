import { useState, useEffect } from "react"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore"
import { useBackupRestoreController } from "@/ui/dialogs/BackupRestore/useBackupRestoreController"
import BackupRestoreDialog from "@/ui/dialogs/BackupRestore/BackupRestoreDialog"

export function useBackupRestoreDialog() {
    const [open, setOpen] = useState(false)
    const [result, setResult] = useState<{
        type: "backup" | "restore"
        data: any
    } | null>(null)

    const toast = useToast()

    const reloadProblems = useProblemStore(s => s.reload)
    const reloadReviewEvents = useReviewEventStore(s => s.reload)
    const reloadMissions = useMissionStore(s => s.reload)

    const controller = useBackupRestoreController()

    const openDialog = () => setOpen(true)
    const closeDialog = () => setOpen(false)

    useEffect(() => {
        if (!result) return

        if (result.type === "backup") {
            const res = result.data
            if (res.ok)
                toast({ message: `${res.value.problemCount}件バックアップしました` })
            else
                toast({ message: "バックアップ失敗", severity: "error" })
        }

        if (result.type === "restore") {
            const res = result.data
            if (res.ok) {
                toast({ message: `${res.value.problemCount}件リストアしました` })
                reloadProblems()
                reloadReviewEvents()
                reloadMissions()
            } else {
                toast({ message: "リストア失敗", severity: "error" })
            }
        }

    }, [result])

    /*

    const dialogElement = (
        <BackupRestoreDialog
            open={open}
            onClose={() => setOpen(false)}
            controller={controller}
            onResult={setResult}
        />
    )*/

    return {
        open, controller,
        openDialog, closeDialog,
        setResult
        //dialogElement,
    }
}