import { Box  } from "@mui/material";


export default function MovesPanel
    ({ children }: { children: React.ReactNode })
 {
    return (
        <Box
            flex={1}
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
            

    