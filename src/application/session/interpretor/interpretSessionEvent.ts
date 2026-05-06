import type { SessionCommand } from "@/application/session/resolveSessionCommand";
import type { SessionEvent } from "@/application/session/SessionEvent";

export function interpretSessionEvent(e: SessionEvent): SessionCommand {
    switch (e.type) {
        case "PROBLEM_SOLVED":
            return { type: "SUBMIT_REVIEW" }

    }
}
