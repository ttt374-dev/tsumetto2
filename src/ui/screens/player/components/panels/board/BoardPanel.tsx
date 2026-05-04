import { Box, Stack } from "@mui/material";

import styles from "./BoardView.module.css";
import HandView from "./HandView";
import BoardView from "./BoardView";
import type { BoardViewModel } from "@/ui/screens/player/vm/PlayerViewModel";
import type { BoardAction } from "@/ui/screens/player/runner/usePlayerRunner";

export default function BoardPanel( {boardModel, actions}: { 
    boardModel: BoardViewModel, actions: BoardAction }) {    
    if (boardModel.status === "error") return <>Error: invalid Position</>
    const { reversed, userSide, position: { hands, sideToMove}} = boardModel
    const upperPlayer = reversed ? "black" : "white"
    const bottomPlayer = reversed ? "white" : "black"

    const { selection } = boardModel
    const { clickHandPiece } = actions
    return (
        <Stack justifyContent="center" alignContent={"center"}  direction="row" >
            <Box className={styles.container}>
                {/* 持駒表示 */}
                <HandView 
                    hand={hands.get(upperPlayer)} sideToMove={sideToMove} owner={upperPlayer}
                    userSide={userSide}
                    selection={selection} onClickHandPiece={clickHandPiece} />

                <BoardView boardModel={boardModel} actions={actions}/>
                {/* 持駒表示 */}
                <HandView 
                    hand={hands.get(bottomPlayer)} sideToMove={sideToMove} owner={bottomPlayer}
                    userSide={userSide}
                    selection={selection} onClickHandPiece={clickHandPiece} />
            </Box>
        </Stack >
    )
}


