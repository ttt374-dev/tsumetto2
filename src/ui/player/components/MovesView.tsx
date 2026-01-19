import { useMemo, useEffect, useRef } from "react";

import { Box } from "@mui/material";
import { Move } from "@/domain/kif/types/Move";
import { Square, type Player } from "@/domain/kif/types/Piece";
import { numberToKanjiTwoDigits } from "./numberToKanji";

interface Props {
    moves: Move[];
    currentPlyIndex: number,
    onMoveClick: (index: number) => void;
}

    
export default function MovesView({ moves: moves, currentPlyIndex, onMoveClick }: Props) {
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


    function formatFrom(from: Square | null) {
        return from ? `(${from.file}, ${from.rank})` : "(-, -)"

    }
    function formatTo(to: Square){
        return `${to.file}${numberToKanjiTwoDigits(to.rank)}`
    }
    function formatPlayer(player: Player): string {
        return player === 'black' ? '▲' : '△'
    }
    function formatMove(move: Move, index: number): string {
        console.log("format move", move)
        const player = index % 2 === 0 ? "black" : "white"
        //const moveText = [formatPlayer(player), formatTo(move.to), displayPiece(move.pieceType, move.promote), formatFrom(move.from)].join("")
        return `${index}: ` + formatPlayer(player) + move.rawtext
        //return `${index}: ${formatPlayer(move.player)} ${move.moveText} ${formatFrom(move.from ?? null)}`
        
    }
    
    function itemStyles(index: number){
        const hilightColor =  "#ffd"
        const itemBgColor = index === currentPlyIndex ? hilightColor : undefined // ハイライト色
        return {
            padding: "2px 0",
            backgroundColor: itemBgColor,
            cursor: "pointer"
        }
    }
    return (
        <Box>
            <div onClick={() => onMoveClick(0)}
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
                        onClick={() => onMoveClick(i + 1)}
                        style={itemStyles(i + 1)}>
                        {formatMove(m, i + 1)}
                    </div>
                ))
            }
        </Box>
    )
}
