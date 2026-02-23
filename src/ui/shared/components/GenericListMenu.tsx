import { IconButton, Menu, MenuItem, ListItemButton, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { type ReactNode, useState } from "react";

type GenericMenuProps = {
    menuItems: ReactNode[]; // メニューの中身を配列で渡す
};

export function GenericListMenu({ menuItems }: GenericMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVertIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {menuItems.map((item, idx) => (
                    <div key={idx}>{item}</div>
                ))}
            </Menu>
        </>
    );
}
