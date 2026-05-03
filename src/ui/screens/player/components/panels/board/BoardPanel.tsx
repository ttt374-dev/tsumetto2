import { Box, Stack } from "@mui/material";

import styles from "./BoardView.module.css";
import { useCurrentPosition } from "../../../store/useGameStore";
import HandView from "./HandView";
import BoardView from "./BoardView";

export default function BoardPanel( { reversed = false}: { reversed?: boolean }) {
    const resPosition = useCurrentPosition()
    if (!resPosition.ok) return <>Error: { resPosition.error.code} at { resPosition.ply } </>
    const { hands } = resPosition.value
    const upperPlayer = reversed ? "black" : "white"
    const bottomPlayer = reversed ? "white" : "black"
    
    return (
        <Stack justifyContent="center" alignContent={"center"}  direction="row" >
            <Box className={styles.container}>
                {/* 持駒表示 */}
                <HandView hand={hands.get(upperPlayer)} owner={upperPlayer} />

                <BoardView position={resPosition.value} reversed={reversed}/>
                {/* 持駒表示 */}
                <HandView hand={hands.get(bottomPlayer)} owner={bottomPlayer} />
            </Box>
        </Stack >
    )
}


