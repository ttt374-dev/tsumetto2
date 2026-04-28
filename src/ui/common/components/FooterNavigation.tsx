import { BottomNavigation, BottomNavigationAction, Button, IconButton, Paper, Stack } from "@mui/material";
import BarChartIcon from '@mui/icons-material/BarChart'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import AssignmentIcon from '@mui/icons-material/Assignment'
import SettingsIcon from '@mui/icons-material/Settings'
import HistoryIcon from '@mui/icons-material/History'
import { routes } from "@/ui/App/useAppNavigation";
import { useNavigate } from "react-router-dom";

export default function FooterNavigation() {
    //const [value, setValue] = useState(0)
    const navigate = useNavigate()

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation                
                onChange={(_event, newValue) => navigate(newValue)}
                showLabels
            >
                <BottomNavigationAction label="ミッション" value={routes.mission} icon={<AssignmentIcon />} />
                <BottomNavigationAction label="ライブラリ" value={routes.library} icon={<MenuBookIcon />} />
                <BottomNavigationAction label="統計" value={routes.stats} icon={<BarChartIcon />} />
                <BottomNavigationAction label="履歴" value={routes.history} icon={<HistoryIcon />} />
            </BottomNavigation>
        </Paper>
    )
}