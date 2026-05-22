import { now } from "lodash"

let audioContext: AudioContext | null =
    null

function getAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContext()
    }

    return audioContext
}

export function playBeep() {
    const ctx = getAudioContext()
    playTone({ frequency: 220, durationMs: 80, oscType: "square" })
}

export function playPingPong() {

    const ctx = getAudioContext()

    const now = ctx.currentTime

    // ピン
    playTone({
        frequency: 880,
        durationMs: 120,
        startTime: now,
    })

    // ポーン
    playTone({
        frequency: 660,
        durationMs: 260,
        startTime: now + 0.14,
    })
}
function playTone({
    frequency,
    durationMs,
    startTime,
    volume = 0.03,
    oscType = "sine",
}: {
    frequency: number
    durationMs: number
    startTime?: number
    volume?: number
    oscType?: OscillatorType
}) {

    const ctx = getAudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const effectiveStartTime = startTime ?? ctx.currentTime
    osc.type = oscType
    //osc.type = "square"

    osc.frequency.value = frequency
    gain.gain.value = volume

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(startTime)
    osc.stop(
        effectiveStartTime +
        durationMs / 1000
    )
}

