import React, { useState } from "react";
import styles from "./AppLayout.module.css";
import { AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { useNavigate } from "react-router-dom";
import { useFileSelector } from "../sharedComponents/useFileSelector";
import { useLibraryController } from "../library/hooks/useLibraryController";
import { useExerciseControl } from "@/application/useExerciseControl";

function DrawerMenu({isOpen, onClose, onNavigateToDashboard, onNavigateToLibrary, onImport}: {
  isOpen: boolean,
  onClose: () => void,
  onNavigateToDashboard: () => void,
  onNavigateToLibrary: () => void,
  onImport: () => void
}){
  return (
          <Drawer anchor="left" open={isOpen} onClose={onClose} >
        <Box width={250} mt={3} role="presentation"  className={styles.header}>
          <List>
            <ListItemButton onClick={() => onNavigateToDashboard()}>
              <ListItemText primary="ダッシュボード" />
            </ListItemButton>
            <ListItemButton onClick={() => onNavigateToLibrary()}>
              <ListItemText primary="ライブラリ" />
            </ListItemButton>
            <ListItemButton onClick={onImport}>
              <ListItemText primary="インポート"/>
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
  )
}

interface Props {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  rightActions?: React.ReactNode;
}

export function AppLayout({ header, footer, children, rightActions  }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  //const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const navigate = useNavigate()

  // インポート用
  const { openFileDialog, inputElement, setOnFilesSelected } =
    useFileSelector(".kif")

  //const c = useLibraryController()
  const c = useExerciseControl()
  setOnFilesSelected(async files => {
    await c.importFiles(Array.from(files))
    //navigate("/library")
  })

  return (
    <div className={styles.container}>
      <AppBar position="static" className={styles.header}>
        <Toolbar >
          {/* ハンバーガー */}
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
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
      <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}
        onNavigateToDashboard={() => navigate("/")}
        onNavigateToLibrary={() => navigate("/library")}
        onImport={openFileDialog}
        />
      
      <div className={styles.main}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    {inputElement}
    </div>
  );
}
