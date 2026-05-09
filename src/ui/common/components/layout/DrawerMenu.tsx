import styles from "./AppLayout.module.css";
import { Box, Divider, Drawer, List, ListItemButton, ListItemText } from "@mui/material";

///////

//////////////////////////////
export type DrawerMenuItem =
    | { type: "item", label: string, action: () => void }
    | { type: "divider" }

export function DrawerMenu({ open, menuItems }: {
    open: boolean,
    menuItems: DrawerMenuItem[]
}) {

    return (
        <Drawer anchor="left" open={open} >
            <Box width={250} mt={3} role="presentation" className={styles.header}>
                <List>
                    {
                        menuItems.map((item, i) => (
                            <DrawerItem item={item} key={i}/>
                        ))
                    }

                </List>
            </Box>
        </Drawer>
    )
}
function DrawerItem({ item }: { item: DrawerMenuItem }) {
    switch (item.type) {
        case "item":
            return <ListItemButton onClick={item.action}>
                <ListItemText primary={item.label} />
            </ListItemButton>
        case "divider":
            return <Divider />

    }
}