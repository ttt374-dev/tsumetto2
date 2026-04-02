// ui/learning/learningPresenter.ts

import type { Learning } from "@/domain/learning/entity/Learning"
import { formatDuration } from "@/ui/common/formatter"


export const learningPresenter = {
  score: {
    label: "スコア",
    getText: (l: Learning) => l.score.toFixed(1),
  },

  nextReviewedAt: {
    label: "次回復習",
    getText: (l: Learning) => new Date(l.nextReviewedAt).toLocaleString(),
  },
  nextReviewedIn: {
    label: "次回復習",
    getText: (l: Learning) => formatDuration(l.nextReviewedAt-Date.now()),
  },
  performance: {
    label: "パフォーマンス",
    getText: (l: Learning) => `[${l.score.toFixed(1)}](${l.solvedCount}:${l.failedCount})`
  }

  /*accuracy: {
    label: "正答率",
    getText: (l: Learning) =>
      `${l.correctCount}/${l.totalCount}`,
  },*/
}

