import { useFileSelector } from "@/ui/sharedComponents/useFileSelector"
import { useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { AppLayout } from "./AppLayout"
import { DrawerMenu } from "./DrawerMenu";

interface Props {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
    rightActions?: React.ReactNode;
    fab?: React.ReactNode;
}

export function AppShell({ header, footer, rightActions, fab, children }: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false)
    const navigate = useNavigate()
    const { openFileDialog } = useFileSelector(".kif")

    return (
        <AppLayout
            header={header}
            footer={footer}
            rightActions={rightActions}
            fab={fab}
            onMenuClick={()=>setDrawerOpen(true)}
            drawer={
                <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}
                    onNavigateToDashboard={() => navigate("/")}
                    onNavigateToLibrary={() => navigate("/library")}
                    onImport={openFileDialog}
                />
            }
        >
            {children}


        </AppLayout>
    )
}
