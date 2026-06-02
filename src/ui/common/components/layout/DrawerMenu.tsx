import type { MenuCommand, MenuItem } from "@/application/navigation/types";
import styles from "./AppLayout.module.css";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

/*
export type DrawerMenuItem ={ 
    label: string
    command: DrawerCommand 
    group: DrawerMenuGroup
}
    //| { type: "divider" }

export type DrawerCommand = 
    | { type: "NAVIGATE", to: string }
    | { type: "OPEN_DIALOG", dialog: "import" | "backupRestore" }
*/
/*export type DrawerMenuGroup =
    | "main"
    | "analysis"
    | "maintenance"
    | "settings"
    */
const drawerMenuGroups = ["main", "analysis", "maintenance", "settings"]
export type DrawerMenuGroup = typeof drawerMenuGroups[number]

//////////////////////////////
export function DrawerMenu({ open, onClose, menuItems, onCommand }: {
    open: boolean,
    onClose: () => void
    menuItems: MenuItem[]
    onCommand: (command: MenuCommand) => void
}) {
    const handleClick = (item: MenuItem) => {
        //if (item.type !== "item") return
        onCommand(item.command)
    }
    
    return (
        <Drawer anchor="left" open={open} onClose={onClose} variant="temporary" >
            <Box width={250} mt={3} role="presentation" className={styles.header}>
                <List>
                    {
                        menuItems.map((item, i) => (
                            <DrawerItem item={item} key={i} onClick={() => handleClick(item)}/>
                        ))
                    }

                </List>
            </Box>
        </Drawer>
    )
}
function DrawerItem({ item, onClick }: { item: MenuItem, onClick: () => void }) {
    return (
        <ListItemButton onClick={onClick}>
            <ListItemIcon>
                {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.label} />
        </ListItemButton>
    )
}
