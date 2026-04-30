import { useMemo, useEffect, useRef } from "react";
import { alpha, useTheme } from "@mui/material/styles"

import { Box } from "@mui/material";
import { Move } from "@/domain/kif/entity/Move";
import { type Player } from "@/domain/kif/entity/Piece";

interface Props {
    moves: Move[];
    currentPlyIndex: number,
    onMoveToPly: (index: number) => void;
}

export function formatPlayer(player: Player): string {
    return player === 'black' ? '▲' : '△'
}
export function formatMove(move: Move, index: number, player: Player): string {
    return `${index}: ` + formatPlayer(player) + move.rawtext

}
const getPlayerFromPly = (plyIndex: number) => plyIndex % 2 ? "black" : "white"

export default function MovesView({ moves: moves, currentPlyIndex, onMoveToPly }: Props) {
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const theme = useTheme()

    useEffect(() => {
        const el = itemRefs.current[currentPlyIndex];
        if (el) {
            el.scrollIntoView({
                block: "center", 
                behavior: "smooth", // ← 再生中は外してもOK
            });
        }
    }, [currentPlyIndex]);

    function itemStyles(index: number) {
        
        //const hilightColor = "#ffd"
        const highlightColor = alpha(
            theme.palette.primary.main,
            theme.palette.mode === "dark" ? 0.2 : 0.4
        )
        const itemBgColor = index === currentPlyIndex ? highlightColor : undefined // ハイライト色
        return {
            padding: "2px 0",
            backgroundColor: itemBgColor,
            cursor: "pointer"
        }
    }
    return (
        <Box>
            <div onClick={() => onMoveToPly(0)}
                style={itemStyles(0)}>
                {"=== 開始局面 ==="}
            </div>
            {
                moves.map((m, i) => {
                    const ply = i + 1
                    return (
                        <div
                            key={ply}
                            ref={(el: HTMLDivElement | null) => {
                                itemRefs.current[ply] = el;
                            }}
                            onClick={() => onMoveToPly(ply)}
                            style={itemStyles(ply)}>
                            {formatMove(m, ply, getPlayerFromPly(ply))}
                        </div>)
                })
            }
        </Box>
    )
}
