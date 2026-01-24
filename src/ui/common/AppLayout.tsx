import React, { useState } from "react";
import styles from "./AppLayout.module.css";
import { AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useFileSelector } from "../sharedComponents/useFileSelector";
//import { useExerciseControl } from "@/application/useExerciseControl";
import { DrawerMenu } from "./DrawerMenu";


interface Props {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  rightActions?: React.ReactNode;
  fab?: React.ReactNode;
}

export function AppLayout({ header, footer, children, rightActions, fab  }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  //const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const navigate = useNavigate()

  // インポート用
  const { openFileDialog, inputElement, setOnFilesSelected } =
    useFileSelector(".kif")

  //const c = useLibraryController()
  /*
  const c = useExerciseControl()
  setOnFilesSelected(async files => {
    await c.importFiles(Array.from(files))
    //navigate("/library")
  })*/

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

      {fab && (
        <Box
          sx={{
            position: "fixed",
            bottom: 116,
            right: 16,
            zIndex: theme => theme.zIndex.drawer + 1,

            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: 500, // App の max-width と合わせる
            pointerEvents: "none",

          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 2, pointerEvents: "auto", height: 100 }}>
            {fab}
          </Box>
        </Box>
      )}
    {inputElement}
    </div>
  );
}
