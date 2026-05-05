import type { DomainEvent } from "@/ui/screens/player/runner/runGameEffects";
import type { SessionCommand } from "@/ui/screens/session/vm/resolveSessionCommand";

export function interpretDomainEvent(e: DomainEvent): SessionCommand {
    switch (e.type) {
        case "PROBLEM_SOLVED":
            return { type: "SUBMIT_REVIEW" }

    }
}
