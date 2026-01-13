import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


export function SummaryScreen(){
    const navigate = useNavigate()
    return (
        <>
            <Box>
                Done
            </Box>
            <Button onClick={() => { navigate("/dashboard")}}>
                Dashboard
            </Button>
        </>
    )
}