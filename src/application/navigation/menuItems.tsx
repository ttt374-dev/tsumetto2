import type { MenuItem } from "@/application/navigation/types";
import { routes } from "@/ui/App/useAppNavigation";
import BarChartIcon from '@mui/icons-material/BarChart'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import AssignmentIcon from '@mui/icons-material/Assignment'
import FileDownloadIcon from "@mui/icons-material/FileDownload"

export const menuItems: MenuItem[] = [
    {
        label: "ミッション",
        icon: <AssignmentIcon />,
        command: { type: "NAVIGATE", to: routes.mission },
        group: "main",
        footNav: true
    },
    {
        label: "ライブラリ",
        icon: <MenuBookIcon />,
        command: { type: "NAVIGATE", to: routes.library }, group: "main",
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
        command: { type: "NAVIGATE", to: routes.stats }, group: "analysis",
        footNav: true
    },
    { label: "履歴", command: { type: "NAVIGATE", to: routes.history }, group: "analysis" },
    { label: "バックアップ・復旧", command: { type: "OPEN_DIALOG", dialog: "backupRestore" }, group: "maintenance" },
    { label: "設定", command: { type: "NAVIGATE", to: routes.settings }, group: "settings" },
]