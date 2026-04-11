import type { Piece } from "@/domain/kif/entity"
import styles from "./BoardView.module.css";

export function SquareView({ piece, selected, onClick, reversed }: {
    piece: Piece | null
    selected: boolean
    onClick?: () => void
    reversed: boolean
}) {
    const rotated = (piece?.owner === 'white' && !reversed) ||
        (piece?.owner === 'black' && reversed)
    return (
        <div
            className={`${styles.cell}  
            ${selected && styles.selected}
            ${rotated && styles.rotated}`}
            onClick={onClick}
        >
            {piece ? piece.format() : null}
        </div>
    )
}