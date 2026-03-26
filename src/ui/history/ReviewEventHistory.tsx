import { Box, List, ListItem, ListItemText } from "@mui/material"
import type { ReviewEvent } from "@/domain/review/ReviewEvent";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useReviewEventStore } from "@/ui/store/useReviewEventStore";
import type { SolvedResult } from "@/domain/learning/entity/Learning";

export function formatSolvedResult(res: SolvedResult) {
    const outcome = res.outcome === "solved" ? "詰み" : res.outcome === "failed" ? "失敗" : "未回答"
    const mistakesString = res.mistakes > 0 ? `(${res.mistakes}miss)` : ""
    const revealedString = res.isRevealed ? `[解答参照]` : ""
    return `: ${outcome} ${mistakesString}${revealedString} (${res.elapsedSec}s)`

}
function formatEvent(event: ReviewEvent): string {
    const byId = useProblemStore(s => s.byId)
    //const eventLog = useReviewEventStore(s=>s.eventLog)
    let content: string
    switch (event.type) {
        case "reviewed":
            const res = event.solvedResult
            content = `${byId[event.problemId].title}${formatSolvedResult(res)}`;
            break
        case "reset": content = `リセット：${byId[event.problemId].title}`; break
    }
    return content
}
function formatDateNumber(number: number): string {
    return new Date(number).toLocaleString()
}
export function ReviewEventHistory() {
    const allevents = useReviewEventStore(s => s.eventLog)
    const num = 100
    const events = allevents
        .slice() // 元配列を破壊しない
        .sort((a, b) => b.at - a.at) // atで降順
        .slice(0, num);
    //const dateString = new Date(props.event.at).toLocaleString()

    return (
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            最近の学習データ
            <List>
                {events.map(event => (
                    <ListItem disablePadding
                        sx={{ borderBottom: 1, borderColor: "divider", px: 1, py: 0 }}>
                        <ListItemText
                            primary={formatEvent(event)}
                            secondary={formatDateNumber(event.at)}>
                        </ListItemText>
                    </ListItem>
                )
                )}
            </List>
        </Box>
    )
}
