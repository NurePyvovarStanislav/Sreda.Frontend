export function getSpeechContentType(
  contentType?: string | null,
): string {
  if (contentType?.trim()) {
    return contentType
  }

  return 'audio/wav'
}

export function playBase64Audio(
  audioBase64: string,
  contentType?: string | null,
): Promise<void> {
  const mime = getSpeechContentType(contentType)
  const audio = new Audio(`data:${mime};base64,${audioBase64}`)
  return audio.play()
}

export function playBlobAudio(blob: Blob): Promise<void> {
  const url = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const audio = new Audio(url)

    const cleanup = () => {
      URL.revokeObjectURL(url)
    }

    audio.onended = () => {
      cleanup()
      resolve()
    }

    audio.onerror = () => {
      cleanup()
      reject(new Error('Не вдалося відтворити аудіо'))
    }

    void audio.play().catch((error: unknown) => {
      cleanup()
      reject(error instanceof Error ? error : new Error('Не вдалося відтворити аудіо'))
    })
  })
}

export function formatRecordingTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
