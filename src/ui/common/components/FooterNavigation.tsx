import { BottomNavigation, BottomNavigationAction, Button, IconButton, Paper, Stack } from "@mui/material";
import BarChartIcon from '@mui/icons-material/BarChart'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import AssignmentIcon from '@mui/icons-material/Assignment'
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import { routes } from "@/ui/App/useAppNavigation";
import { useNavigate } from "react-router-dom";
import { useContext, type ReactNode } from "react";
import { OpenImportContext } from "@/ui/common/components/layout/AppShell";

type NavItem =
    | { type: "route"; label: string; value: string; icon: ReactNode }
    | { type: "action"; label: string; onClick: () => void; icon: ReactNode }

export default function FooterNavigation() {
    const navigate = useNavigate()
    const openImport = useContext(OpenImportContext)

    const navItems: NavItem[] = [
        { type: "route", label: "ミッション", value: routes.mission, icon: <AssignmentIcon /> },
        { type: "route", label: "ライブラリ", value: routes.library, icon: <MenuBookIcon /> },
        { type: "route", label: "統計", value: routes.stats, icon: <BarChartIcon /> },
        {
            type: "action",
            label: "取込",
            icon: <FileDownloadIcon />,
            onClick: () => openImport?.()
        },
    ]

    return (
        <BottomNavigation
            onChange={(_event, newValue) => {
                const item = navItems.filter(i => i.type === "route").find(i => i.value === newValue)
                if (item) navigate(item.value)
            }}
            showLabels
        >
            {navItems.map(item => (
                <BottomNavigationAction
                    key={item.label}
                    label={item.label}
                    value={item.type === "route" ? item.value : item.label} // actionはダミーvalue
                    icon={item.icon}
                    onClick={item.type === "action" ? item.onClick : undefined}
                />
            ))}
        </BottomNavigation>
    )
}