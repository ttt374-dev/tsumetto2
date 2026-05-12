let audioContext: AudioContext | null =
  null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext()
  }

  return audioContext
}

export function playBeep({
    frequency = 220,
    durationMs = 80,
    volume = 0.03,
}: {
    frequency?: number
    durationMs?: number
    volume?: number
} = {}) {

    const audioContext = getAudioContext()
        //new AudioContext()

    const oscillator =
        audioContext.createOscillator()

    const gainNode =
        audioContext.createGain()

    oscillator.type = "square"

    oscillator.frequency.value =
        frequency

    gainNode.gain.value = volume

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.start()

    setTimeout(() => {
        oscillator.stop()
        //audioContext.close()
    }, durationMs)
}