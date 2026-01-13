import { useMemo, useEffect, useRef } from "react";

import type { Move, Position, PlayerType, KifEvent, GameStart } from "@/domain/kif/types/";

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


    function formatFrom(from: Position | null) {
        return from ? `(${from.file}, ${from.rank})` : "(-, -)"

    }
    function formatPlayer(player: PlayerType): string {
        return player === 'black' ? '▲' : '△'
    }
    function formatMove(move: Move, index: number): string {
        return `${index}: ${formatPlayer(move.player)} ${move.moveText} ${formatFrom(move.from ?? null)}`
    }
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

    }

    // 開始局面を表示させるため、先頭に GameStartを挿入
    const start: GameStart = { type: "start"}
    const eventRows = [start, ...moves]
    //const toViewerIndex = (moveIndex: number) => { moveIndex+1 }
    return (        
        <div>
            {
                eventRows.map((m, i) => (
                    <div
                        key={i}
                        ref={(el: HTMLDivElement | null) => {
                            itemRefs.current[i] = el;
                        }}
                        onClick={() => onMoveClick(i)}
                        style={{
                            padding: "2px 0",
                            backgroundColor: i === currentPlyIndex ? "#ffd" : undefined, // ハイライト色
                            cursor: "pointer"

                        }}>
                        { formatEvent(m, i)}
                    </div>
                ))
            }
        </div>
    )
}