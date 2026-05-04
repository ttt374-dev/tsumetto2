import { Box, Stack } from "@mui/material";

import styles from "./BoardView.module.css";
import HandView from "./HandView";
import BoardView from "./BoardView";
import type { BoardViewModel } from "@/ui/screens/player/vm/PlayerViewModel";
import { useBoardInputStore } from "@/ui/screens/player/store/useBoardInputStore";

export default function BoardPanel( {boardModel}: { boardModel: BoardViewModel }) {    
    if (boardModel.status === "error") return <>Error: invalid Position</>
    const { reversed, position: { hands, sideToMove}} = boardModel
    const upperPlayer = reversed ? "black" : "white"
    const bottomPlayer = reversed ? "white" : "black"

    const selection = useBoardInputStore(s=>s.selection) // TODO: そとだし
    const clickHandPiece = useBoardInputStore(s => s.clickHandPiece)

    return (
        <Stack justifyContent="center" alignContent={"center"}  direction="row" >
            <Box className={styles.container}>
                {/* 持駒表示 */}
                <HandView 
                    hand={hands.get(upperPlayer)} sideToMove={sideToMove} owner={upperPlayer}
                    selection={selection} onClickHandPiece={clickHandPiece} />

                <BoardView model={boardModel}/>
                {/* 持駒表示 */}
                <HandView 
                    hand={hands.get(bottomPlayer)} sideToMove={sideToMove} owner={bottomPlayer}
                    selection={selection} onClickHandPiece={clickHandPiece} />
            </Box>
        </Stack >
    )
}


