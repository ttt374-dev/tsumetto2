import type { Piece } from "@/domain/kif/entity"
import styles from "./BoardView.module.css";
import { useState } from "react";

export function SquareView({ piece, selected, onClick, reversed, lastTo, lastFrom }: {
    piece: Piece | null
    selected: boolean
    onClick?: () => void
    reversed: boolean
    lastTo: boolean
    lastFrom: boolean
}) {
    const rotated = (piece?.owner === 'white' && !reversed) ||
        (piece?.owner === 'black' && reversed)
    const [flash, setFlash] = useState(false)

    const handleClick = () => {
        setFlash(true)

        // すぐ消す（100〜150msくらいが自然）
        setTimeout(() => setFlash(false), 120)
        onClick?.()
    }
    return (
        <div
            className={`${styles.cell}  
            ${selected && styles.selected}
            ${flash && styles.flash}
            ${lastTo && styles.lastTo}
            ${lastFrom && styles.lastFrom}
            ${rotated && styles.rotated}
            `}
            
            onClick={handleClick}
        >
            {piece ? piece.format() : null}
        </div>
    )
}