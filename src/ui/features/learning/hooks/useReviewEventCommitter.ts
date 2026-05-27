import type { ProblemId } from "@/domain/problem/entity/Problem"
import type { NewReviewEvent, ReviewEvent } from "@/domain/review/types/ReviewEvent"
import type { SolvedResult } from "@/domain/review/types/solvedResult"
import type { SessionId } from "@/domain/session/entity/Session"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useLearningRecordStore } from "@/ui/features/learning/hooks/useLearningRecordStore"
import { useReviewEventStore } from "@/ui/features/learning/hooks/useReviewEventStore"
import { v4 } from "uuid"

function createReviewEventId() { return v4() }

export function useReviewEventCommitter() {
    const repos = useRepositoryContext()
    const applyReviewEvent = useLearningRecordStore(s => s.apply)
    const appendLocal = useReviewEventStore(s=>s.appendLocal)
    const removeLocal = useReviewEventStore(s=>s.removeLocal)
    //const rollback = useReviewEventStore(s=>s.rollback)

    const append = async (newevent: NewReviewEvent): Promise<ReviewEvent> => {

        const prev = useReviewEventStore.getState().eventLog
        const event: ReviewEvent = {
            ...newevent,
            id: createReviewEventId(),
            at: Date.now(),
        }

        // optimistic append
        appendLocal(event)

        try {
            await repos.reviewEvent.append(event)
            applyReviewEvent(event)
            return event
        } catch (e) {
            //rollback(prev)
            removeLocal(event.id)
            throw e
        }
    }

    const appendReview = async (problemId: ProblemId, sessionId: SessionId, solvedResult: SolvedResult) => {
        const event: NewReviewEvent = {
            type: "reviewed",
            problemId, sessionId: sessionId, solvedResult: solvedResult,
            //actions: actions
        }
        //console.log("append review", event)        
        return await append(event);
    }
    const appendReset = async (problemId: ProblemId) => {
        const event: NewReviewEvent = {
            type: "reset", problemId
        }
        return await append(event)
    }
    return { appendReview, appendReset }
}