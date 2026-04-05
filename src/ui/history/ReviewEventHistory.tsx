import { Box, List, ListItem, ListItemText } from "@mui/material"
import type { ReviewEvent } from "@/domain/review/ReviewEvent";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useReviewEventStore } from "@/ui/store/useReviewEventStore";
import { calculateScore } from "@/domain/learning/service/calculateScore";
import { formatDateNumber } from "@/ui/common/formatter/formatDateNumber";
import { toSolvedResultViewData } from "@/ui/domains/learning/solvedResultPresenter";

function formatEvent(title: string, event: ReviewEvent): string {
    let content: string
    switch (event.type) {
        case "reviewed":
            const res = event.solvedResult
            const score = calculateScore(res)
            const vd = toSolvedResultViewData(res)
            content = `${title} [${score}] ${vd.summaryText}`;
            break
        case "reset": content = `リセット：${title}`; break
    }
    return content
}

function HistoryListItem({ event }: {
    event: ReviewEvent
}) {
    const byId = useProblemStore(s => s.byId)

    return (<ListItem disablePadding
        sx={{ borderBottom: 1, borderColor: "divider", px: 1, py: 0 }}>
        <ListItemText
            primary={formatEvent(byId[event.problemId]?.title, event)}
            secondary={formatDateNumber(event.at)}>
        </ListItemText>
    </ListItem>)

}
export function ReviewEventHistory() {

    const allevents = useReviewEventStore(s => s.eventLog)
    const num = 100
    const events = allevents
        .slice() // 元配列を破壊しない
        .sort((a, b) => b.at - a.at) // atで降順
        .slice(0, num);

    return (
        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            最近の学習データ
            <List>
                {events.map(event => 
                    <HistoryListItem event={event} />                
                )}
            </List>
        </Box>
    )
}
