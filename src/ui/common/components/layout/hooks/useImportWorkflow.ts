import { createContext, useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/ui/App/providers/ToastProvider";
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { routes } from "@/ui/App/useAppNavigation";
import { useImportController } from "@/ui/dialogs/Import/useImportController";
import { createSessionId, useSessionStore } from "@/ui/screens/session/store/useSessionStore";

export function useImportWorkflow() {
    //const navigate = useNavigate()
    const toast = useToast()

    //const reload = useProblemStore(s => s.reload)
    //const startSession = useSessionStore(s => s.start)

    const importController = useImportController()

    useEffect(() => {
        if (!importController.result) return
        //reload()
        toast({
            message: `imported: ${importController.result.summary.imported}, skipped: ${importController.result.summary.skipped}, failed: ${importController.result.summary.failed}`
        });

        //const ids = importController.result.results.filter(r => r.status === "imported").map(r => r.problemId)
        //startSession(createSessionId(), ids)
        //navigate(routes.list, { state: { title: "imported kif files", ids: ids } })
    }, [importController.result])

    return importController
}