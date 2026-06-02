import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { menuItems } from "@/application/navigation/menuItems";
import type { MenuCommand } from "@/application/navigation/types";

export default function FooterNavigation({onCommand}: {
    onCommand: (cmd: MenuCommand) => void
}) {
    
    return (
        <BottomNavigation showLabels>
            { menuItems.filter(v=>v.footNav).map(item=>
                <BottomNavigationAction
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    onClick={() => onCommand(item.command)}
                />
            )}            
        </BottomNavigation>
    )
}