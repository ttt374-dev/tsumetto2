import type { MenuItem } from "@/application/navigation/types";
import { routePaths } from "@/router/paths";
import BarChartIcon from '@mui/icons-material/BarChart'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import AssignmentIcon from '@mui/icons-material/Assignment'
import FileDownloadIcon from "@mui/icons-material/FileDownload"
import HistoryIcon from '@mui/icons-material/History'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SettingsIcon from '@mui/icons-material/Settings'

export const menuItems: MenuItem[] = [
    {
        label: "ミッション",
        icon: <AssignmentIcon />,
        command: { type: "NAVIGATE", to: routePaths.mission },
        group: "main",
        footNav: true
    },
    {
        label: "ライブラリ",
        icon: <MenuBookIcon />,
        command: { type: "NAVIGATE", to: routePaths.library }, group: "main",
        footNav: true
    },
    {
        label: "棋譜取込",
        icon: <FileDownloadIcon />,
        command: { type: "OPEN_DIALOG", dialog: "import" }, group: "main",
        footNav: true
    },
    {
        label: "統計",
        icon: <BarChartIcon />,
        command: { type: "NAVIGATE", to: routePaths.stats }, group: "analysis",
        footNav: true
    },
    { label: "履歴", 
        icon: <HistoryIcon/>,
        command: { type: "NAVIGATE", to: routePaths.history }, group: "analysis" },
    { 
        label: "メンテナンス管理", 
        icon: <AdminPanelSettingsIcon/>,
        command: { type: "NAVIGATE", to: routePaths.maintenance}, group: "maintenance"
        //command: { type: "OPEN_DIALOG", dialog: "backupRestore" }, group: "maintenance" 
        },
    { label: "設定", 
        icon: <SettingsIcon/>,
        command: { type: "NAVIGATE", to: routePaths.settings }, group: "settings" },
]