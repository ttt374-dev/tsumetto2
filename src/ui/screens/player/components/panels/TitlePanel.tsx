import { Box, Collapse, Typography } from "@mui/material";
import { useState } from "react";

export default function TitlePanel({ title }: {
    title: React.ReactNode
}) {
    const [expanded, setExpanded] = useState(false)
    const toggleExpanded = () => setExpanded(v=>!v)
    return (
        <Box
            onClick={toggleExpanded}
            sx={{
                minWidth: 0,
                cursor: "pointer",
            }}
        >
            <Collapse
                in={expanded}
                collapsedSize={24}
            >
                <Typography
                    variant="body1"
                    sx={{
                        overflow: "hidden",
                        textOverflow: expanded
                            ? undefined
                            : "ellipsis",

                        whiteSpace: expanded
                            ? "normal"
                            : "nowrap",
                        wordBreak: "break-word",
                    }}
                >
                    {title}
                </Typography>
            </Collapse>
        </Box>
    )
}