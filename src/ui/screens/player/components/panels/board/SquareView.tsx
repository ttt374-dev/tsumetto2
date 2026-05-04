import { useState } from "react";

import { Board, type Move, type Piece, type Square } from "@/domain/kif/entity"
import styles from "./BoardView.module.css";
import type { BoardOKViewModel } from "@/ui/screens/player/vm/PlayerViewModel";

type SquareUIModel = {
    square: Square
    piece: Piece | null
    isSelected: boolean
    isLastFrom: boolean
    isLastTo: boolean
    rotated: boolean
}

export function buildSquareModel(square: Square, boardModel: BoardOKViewModel): SquareUIModel {
    const { selection, ply, moves, reversed, position: { board} } = boardModel
    const lastMove = ply > 0 ? moves[ply - 1] : undefined
    const isLastFrom = lastMove !== undefined && lastMove.from !== null && square.equals(lastMove.from)
    const isLastTo = lastMove !== undefined && square.equals(lastMove.to)
    const piece = board.get(square)
    const rotated =
        !!piece &&
        (
            (piece.owner === "white" && !reversed) ||
            (piece.owner === "black" && reversed)
        )
    return {
        square, 
        isSelected: selection.type == "board" && square.equals(selection.square),
        piece,
        isLastFrom, isLastTo, rotated,
    }
}

export function SquareView({squareModel, onClick} : {     
    squareModel: SquareUIModel
    onClick: () => void
}){    
    const [flash, setFlash] = useState(false)
    const { square, isSelected, isLastTo, isLastFrom, rotated, piece } = squareModel

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