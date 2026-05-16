import { useState } from "react";

import { Board, type Piece, type Square } from "@/domain/kif/entity"
import styles from "./BoardView.module.css";
import type { BoardViewModel } from "@/ui/screens/player/hooks/usePlayerViewModel";
import { useGameUIStore } from "@/ui/screens/player/store/useGameUIStore";


type SquareUIModel = {
    square: Square
    piece: Piece | null
    isSelected: boolean
    isLastFrom: boolean
    isLastTo: boolean
    isNext: boolean
    rotated: boolean
}

export function buildSquareModel(square: Square, boardModel: BoardViewModel): SquareUIModel {
    const { selection, lastMove, nextMove, reversed, position: { board} } = boardModel
    const hintEnabled = useGameUIStore(s=>s.hintEnabled)
    //const lastMove = ply > 0 ? moves[ply - 1] : undefined
    const isLastFrom = lastMove !== undefined && lastMove.from !== null && square.equals(lastMove.from)
    const isLastTo = lastMove !== undefined && square.equals(lastMove.to)
    const isNext = hintEnabled && nextMove ? square.equals(nextMove.to) : false
    const piece = board.get(square)
    const rotated =
        !!piece &&
        (
            (piece.owner === "white" && !reversed) ||
            (piece.owner === "black" && reversed)
        )
    //console.log("nextmove", nextMove, isNext)
    return {
        square, 
        isSelected: selection.type == "board" && square.equals(selection.square),
        piece,
        isLastFrom, isLastTo, rotated, isNext,
    }
}

export function SquareView({squareModel, onClick} : {     
    squareModel: SquareUIModel
    onClick: () => void
}){    
    const [flash, setFlash] = useState(false)
    const { square, isSelected, isLastTo, isLastFrom, isNext, rotated, piece } = squareModel

    const handleClick = () => {
        setFlash(true)

        // すぐ消す（100〜150msくらいが自然）
        setTimeout(() => setFlash(false), 120)
        onClick()
    }    

    return (
        <div
            key={Board.squareKey(square)}
            className={`${styles.cell}  
            ${isSelected && styles.selected}
            ${isNext && styles.nextMove}
            ${flash && styles.flash}
            ${isLastTo && styles.lastTo}
            ${isLastFrom && styles.lastFrom}
            ${rotated && styles.rotated}
            `}
            
            onClick={handleClick}
        >
            {piece ? piece.format() : null}
        </div>
    )
}