import { useNavigate } from "react-router-dom";
import styles from "./AppLayout.module.css";
import { Box, Divider, Drawer, List, ListItemButton, ListItemText } from "@mui/material";

///////

//////////////////////////////
export type DrawerMenuItem =
    | { type: "item", label: string, command: DrawerCommand }
    | { type: "divider" }

export type DrawerCommand = 
    | { type: "NAVIGATE", to: string }
    | { type: "OPEN_DIALOG", dialog: "import" | "backupRestore" }

export function DrawerMenu({ open, menuItems, onCommand }: {
    open: boolean,
    menuItems: DrawerMenuItem[]
    onCommand: (command: DrawerCommand) => void
}) {
    const handleClick = (item: DrawerMenuItem) => {
        if (item.type !== "item") return
        onCommand(item.command)
    }
    return (
        <Drawer anchor="left" open={open} >
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
function DrawerItem({ item, onClick }: { item: DrawerMenuItem, onClick: () => void }) {
    switch (item.type) {
        case "item":
            return <ListItemButton onClick={onClick}>
                <ListItemText primary={item.label} />
            </ListItemButton>
        case "divider":
            return <Divider />

    }
}
