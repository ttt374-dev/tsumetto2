import { Box, Stack } from "@mui/material";

import styles from "./BoardView.module.css";
import { useCurrentPosition } from "../../../store/useGameStore";
import HandView from "./HandView";
import BoardView from "./BoardView";

export default function BoardPanel( { reversed = false}: { reversed?: boolean }) {
    const resPosition = useCurrentPosition()
    if (!resPosition.ok) return <>Error</>
    const { hands } = resPosition.value
    const topPlayer = reversed ? "black" : "white"
    const bottomPlayer = reversed ? "white" : "black"
    
    return (
        <Stack justifyContent="center" alignContent={"center"}  direction="row" >
            <Box className={styles.container}>
                {/* 持駒表示 */}
                <HandView hand={hands.get(topPlayer)} owner={topPlayer} />

                <BoardView position={resPosition.value} reversed={reversed}/>
                {/* 持駒表示 */}
                <HandView hand={hands.get(bottomPlayer)} owner={bottomPlayer} />
            </Box>
        </Stack >
    )
}


