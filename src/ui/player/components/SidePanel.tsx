import { Box, Stack, Typography, type SxProps } from "@mui/material";
import MovesView from "./MovesView";
import type { Theme } from "@emotion/react";


export default function SidePanel
    ({ children }: { children: React.ReactNode })
 {
    return (
        <Box
            border={1}
            borderColor="divider"
            sx={
                {
                    display: "flex",
                    justifyContent: "center",
                    overflowY: "auto",
                    flexGrow: 1,
                    gap: 2,
                    p: 1,
                }                
            }
        >
            { children }
            </Box>
    )
}
            

    