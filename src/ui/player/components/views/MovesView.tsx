import { useMemo, useEffect, useRef } from "react";

import { Box } from "@mui/material";
import { Move } from "@/domain/kif/entity/Move";
import { Square, type Player } from "@/domain/kif/entity/Piece";

interface Props {
    moves: Move[];
    currentPlyIndex: number,
    onMoveToPly: (index: number) => void;
}

export function formatPlayer(player: Player): string {
    return player === 'black' ? '▲' : '△'
}
export function formatMove(move: Move, index: number): string {
    //console.log("format move", move)
    const player = index % 2 === 1 ? "black" : "white"
    return `${index}: ` + formatPlayer(player) + move.rawtext

}

export default function MovesView({ moves: moves, currentPlyIndex, onMoveToPly }: Props) {
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const el = itemRefs.current[currentPlyIndex];
        if (el) {
            el.scrollIntoView({
                block: "nearest",   // ← 上下どちらか近い方へ
                behavior: "smooth", // ← 再生中は外してもOK
            });
        }
    }, [currentPlyIndex]);




    function itemStyles(index: number) {
        const hilightColor = "#ffd"
        const itemBgColor = index === currentPlyIndex ? hilightColor : undefined // ハイライト色
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
                moves.map((m, i) => (
                    <div
                        key={i + 1}
                        ref={(el: HTMLDivElement | null) => {
                            itemRefs.current[i + 1] = el;
                        }}
                        onClick={() => onMoveToPly(i + 1)}
                        style={itemStyles(i + 1)}>
                        {formatMove(m, i + 1)}
                    </div>
                ))
            }
        </Box>
    )
}
