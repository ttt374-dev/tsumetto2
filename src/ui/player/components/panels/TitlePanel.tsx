import { Box, Typography } from "@mui/material";

export default function TitlePanel({title}: {title: React.ReactNode}) {
    return (<Box sx={{
        whiteSpace: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling: "touch",
    }}>
        <Typography variant="body1">{title} </Typography>
    </Box>)
    
}