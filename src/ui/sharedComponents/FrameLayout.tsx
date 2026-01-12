import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function FrameLayout() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Header をここに */}

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <Outlet />
      </Box>

      {/* Footer をここに */}
    </Box>
  );
}
