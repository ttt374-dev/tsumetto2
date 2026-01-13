import React, { useState } from "react";
import styles from "./AppLayout.module.css";
import { AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { useNavigate } from "react-router-dom";


interface Props {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  rightActions?: React.ReactNode;
}

export function AppLayout({ header, footer, children, rightActions  }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const navigate = useNavigate()
  //const learningApi = useLearningRecordsContext() // TODO: temp
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <div className={styles.container}>
      <AppBar position="static" className={styles.header}>
        <Toolbar >
          {/* ハンバーガー */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography>
            { header }
          </Typography>
          <Box sx={{flexGrow: 1}}></Box>

          
          { rightActions}          
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} >
        <Box width={250} mt={3} role="presentation"  className={styles.header}>
          <List>
            <ListItemButton onClick={() => navigate("/dashboard")}>
              <ListItemText primary="ダッシュボード" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/library")}>
              <ListItemText primary="ライブラリ" />
            </ListItemButton>

            <ListItemButton onClick={() => console.log("settings")}>
              <ListItemText primary="設定" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      
      <div className={styles.main}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}

    </div>
  );
}
