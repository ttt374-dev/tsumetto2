import { useMemo, useEffect, useRef } from "react";

import { Box } from "@mui/material";
import { Move } from "@/domain/kif/types/Move";
import { displayPiece, type Player, type Square } from "@/domain/kif/types/Piece";
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
        const player = index % 2 === 0 ? "black" : "white"
        const moveText = [formatPlayer(player), formatTo(move.to), displayPiece(move.pieceType, move.promote), formatFrom(move.from)].join("")
        return moveText
        //return `${index}: ${formatPlayer(move.player)} ${move.moveText} ${formatFrom(move.from ?? null)}`
        
    }
    /*
    function formatEvent(event: KifEvent, index: number): string {
        switch (event.type) {
            case "start":
                return "=== 開始局面 ==="
            case "move":
                return formatMove(event, index)
            case "end":
                return `=== 終了 (${event.reason}) ===`
            default:
                return ""
        }

    }*/

    // 開始局面を表示させるため、先頭に GameStartを挿入
    //const start: GameStart = { type: "start"}
    //const eventRows = [start, ...moves]
    //const toViewerIndex = (moveIndex: number) => { moveIndex+1 }
    
    const hilightColor =  "#ffd"
    return (        
        <Box>
                <div onClick={() => onMoveClick(0)}
                    style={{
                            padding: "2px 0",
                            backgroundColor: 0 === currentPlyIndex ? hilightColor : undefined, // ハイライト色
                            cursor: "pointer"
                        }}>
                    {"=== 開始局面 ==="}
                </div>
                
            {

                moves.map((m, i) => (
                    <div
                        key={i+1}
                        ref={(el: HTMLDivElement | null) => {
                            itemRefs.current[i+1] = el;
                        }}
                        onClick={() => onMoveClick(i+1)}
                        style={{
                            padding: "2px 0",
                            backgroundColor: i+1 === currentPlyIndex ? hilightColor : undefined, // ハイライト色
                            cursor: "pointer"

                        }}>
                        { formatMove(m, i+1)}
                    </div>
                ))
            }
        </Box>
    )
}