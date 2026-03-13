import { Box, Stack } from "@mui/material";

import styles from "./BoardView.module.css";
import { useCurrentPosition, useGameStore } from "../../../hooks/useGameStore";
import HandView from "./HandView";
import BoardView from "./BoardView";

export default function BoardPanel() {
    //const { moves: correctMoves, ply, advancePly, makeMistake, makeResolve} = useGameStore()
    const { board, hands } = useCurrentPosition()
    
    return (
        <Stack justifyContent="center" alignContent={"center"}  direction="row" >
            <Box className={styles.container}>
                {/* 持駒表示 */}
                <HandView hand={hands.get("white")} owner="white" />

                <BoardView/>
                {/* 持駒表示 */}
                <HandView hand={hands.get("black")} owner="black" />
            </Box>
        </Stack >
    )
}


