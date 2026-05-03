import { Box, Stack } from "@mui/material";

import styles from "./BoardView.module.css";
import HandView from "./HandView";
import BoardView from "./BoardView";
import type { BoardViewModel } from "@/ui/screens/player/hooks/usePlayerViewModel";

export default function BoardPanel( {vm}: { vm: BoardViewModel }) {    
    if (vm.status === "error") return <>Error: invalid Position</>
    const { hands, sideToMove } = vm.position
    const upperPlayer = vm.reversed ? "black" : "white"
    const bottomPlayer = vm.reversed ? "white" : "black"
    
    return (
        <Stack justifyContent="center" alignContent={"center"}  direction="row" >
            <Box className={styles.container}>
                {/* 持駒表示 */}
                <HandView hand={hands.get(upperPlayer)} sideToMove={sideToMove} owner={upperPlayer} />

                <BoardView position={vm.position} reversed={vm.reversed}/>
                {/* 持駒表示 */}
                <HandView hand={hands.get(bottomPlayer)} sideToMove={sideToMove} owner={bottomPlayer} />
            </Box>
        </Stack >
    )
}


