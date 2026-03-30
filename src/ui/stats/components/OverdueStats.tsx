import { Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Typography, Stack, Box} from "@mui/material"
import { useMemo } from "react"

import type { LearningRecord } from "@/domain/learning/entity/Learning"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore"
import { useProblemStore } from "@/ui/store/useProblemStore"

type OverdueItem = {
  id: ProblemId
  overdueDays: number
  dueDate: Date
}

function buildOverdueHistogram(
  ids: ProblemId[],
  learningRecords: LearningRecord
) {
  const now = new Date()

  const bins = [
    { label: "期限内", min: -Infinity, max: -1 },
    { label: "-3日遅れ", min: 0, max: 3 },
    { label: "4-7日遅れ", min: 4, max: 7 },
    { label: "8-14日遅れ", min: 8, max: 14 },
    { label: "15-30日遅れ", min: 15, max: 30 },
    { label: "30日以上遅れ", min: 31, max: Infinity },
  ]

  const counts = bins.map(b => ({
    label: b.label,
    count: 0,
  }))

  let noDueDate = 0

  ids.forEach(id => {
    const record = learningRecords[id]

    if (!record?.nextReviewedAt) {
      noDueDate++
      return
    }

    const diffDays = Math.floor(
      (now.getTime() - new Date(record.nextReviewedAt).getTime()) /
        (1000 * 60 * 60 * 24)
    )

    const binIndex = bins.findIndex(
      b => diffDays >= b.min && diffDays <= b.max
    )

    if (binIndex !== -1) {
      counts[binIndex].count++
    }
    //console.log("hist", )
  })

  return [
    ...counts,
    { label: "期限未設定", count: noDueDate },
  ]
}
function getOverdueItems(
  ids: ProblemId[],
  learningRecords: LearningRecord
): OverdueItem[] {
  const now = new Date()

  return ids
    .map(id => {
      const record = learningRecords[id]
      if (!record?.nextReviewedAt) return null

      const diffDays = Math.floor(
        (now.getTime() - new Date(record.nextReviewedAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )

      if (diffDays <= 0) return null

      return {
        id,
        overdueDays: diffDays,
        dueDate: new Date(record.nextReviewedAt),
      }
    })
    .filter((v): v is OverdueItem => v !== null)
    .sort((a, b) => b.overdueDays - a.overdueDays) // 遅い順
}

type Props = {
  items: OverdueItem[]
}

export function OverdueTable({ items }: Props) {
  if (items.length === 0) {
    return <Typography>🎉 期限超過はありません</Typography>
  }

  return (
    <Paper sx={{ overflow: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Problem</TableCell>
            <TableCell align="right">遅延日数</TableCell>
            <TableCell align="right">期限</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell align="right">
                {item.overdueDays} 日
              </TableCell>
              <TableCell align="right">
                {item.dueDate.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

type HistogramItem = {
  label: string
  count: number
}

export function OverdueHistogram({
  data,
}: {
  data: HistogramItem[]
}) {
  const filtered = data.filter(d => d.count > 0)

  if (filtered.length === 0) {
    return <Typography>🎉 遅延はありません</Typography>
  }

  const max = Math.max(...filtered.map(d => d.count), 1)

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        {filtered.map(item => {
          const widthPercent = (item.count / max) * 100

          return (
            <Box key={item.label}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 0.5 }}
              >
                <Typography variant="body2">
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600 }}
                >
                  {item.count}
                </Typography>
              </Stack>

              <Box
                sx={{
                  height: 10,
                  backgroundColor: "grey.200",
                  borderRadius: 5,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${widthPercent}%`,
                    height: "100%",
                    backgroundColor: "error.main",
                    transition: "width 0.4s ease",
                  }}
                />
              </Box>
            </Box>
          )
        })}
      </Stack>
    </Paper>
  )
}
export function OverdueStats(){
    const ids = useProblemStore(s=>s.activeProblems).map(p=>p.id)
    const learningRecords = useLearningRecordStore(s=>s.records)
    const overdueItems = useMemo(
  () => getOverdueItems(ids, learningRecords),
  [ids, learningRecords]
)

const histogram = useMemo(
  () => buildOverdueHistogram(ids, learningRecords)
      .filter(h => h.label !== "期限内" && h.label !== "期限未設定"),
  [ids, learningRecords]
    )

    return (
        <Paper>
            遅延
            <OverdueHistogram data={histogram} />
            
        </Paper>
    )
}