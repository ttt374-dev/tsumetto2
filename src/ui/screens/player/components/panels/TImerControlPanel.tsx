import { useTimerStore } from "@/ui/screens/player/store/useTimerStore"
import { Button, Typography } from "@mui/material"

export default function TimerControlPanel(){
    function formatTime(sec: number) {
        const m = Math.floor(sec / 60)
        const s = sec % 60
        return `${m}:${s.toString().padStart(2, "0")}`
    }
    const { toggle, isRunning, elapsedSec} = useTimerStore()
    return (

        <Button
            onClick={toggle}
            variant="contained"
            sx={{
                p: 1,
                m: 1,
                borderRadius: 2,
                background: "linear-gradient(145deg, #ffffff, #e6e6e6)",

                color: "#333",
                textTransform: "none",
                "&:hover": {
                    background: "linear-gradient(145deg, #f0f0f0, #dcdcdc)",
                },
            }}
        >
            <Typography variant="body2" fontWeight="bold" sx={{ cursor: "pointer" }}>
                {isRunning ? "II" : "▶"} {formatTime(elapsedSec)}
            </Typography>
        </Button>
        )
}