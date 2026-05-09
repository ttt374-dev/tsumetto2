import { create } from "zustand";

type TimerStore = {
    elapsedSec: number
    isRunning: boolean

    start: () => void
    stop: () => void
    reset: () => void
    restart: () => void
    toggle: () => void
}

let intervalId: number | undefined

export const useTimerStore = create<TimerStore>((set, get) => ({
    elapsedSec: 0,
    isRunning: false,

    start: () => {
        if (get().isRunning) return

        set({ isRunning: true })

        intervalId = window.setInterval(() => {
            set(s => ({ elapsedSec: s.elapsedSec + 1 }))
        }, 1000)
    },

    stop: () => {
        if (intervalId !== undefined) {
            clearInterval(intervalId)
            intervalId = undefined
        }

        set({ isRunning: false })
    },

    reset: () => {
        const { stop } = get()
        stop()
        set({ elapsedSec: 0 })
    },
    restart: () => {
        const { reset, start } = get()
        reset(); start();
    },
    toggle: () => {
        const { isRunning, start, stop } = get()
        isRunning ? stop() : start()
    }
}))