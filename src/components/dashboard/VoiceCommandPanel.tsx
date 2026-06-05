import {
  Button,
  FileButton,
  Group,
  SegmentedControl,
  Stack,
  Text,
} from '@mantine/core'
import {
  IconMicrophone,
  IconPlayerPlay,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import { formatRecordingTime } from '../../utils/audio'

type VoiceInputMode = 'file' | 'microphone'

interface VoiceCommandPanelProps {
  onProcess: (file: File) => void
  isProcessing?: boolean
}

export function VoiceCommandPanel({
  onProcess,
  isProcessing = false,
}: VoiceCommandPanelProps) {
  const [mode, setMode] = useState<VoiceInputMode>('file')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [micError, setMicError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  useEffect(() => {
    return () => {
      stopMediaStream()
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  useEffect(() => {
    if (!isRecording) {
      return
    }

    const timerId = window.setInterval(() => {
      setRecordingSeconds((current) => current + 1)
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [isRecording])

  const stopMediaStream = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
    mediaStreamRef.current = null
  }

  const resetPreviewUrl = (nextUrl: string | null) => {
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current)
      }
      return nextUrl
    })
  }

  const clearRecording = () => {
    const recorder = mediaRecorderRef.current
    if (recorder) {
      recorder.onstop = null
      if (recorder.state === 'recording') {
        recorder.stop()
      }
    }

    stopMediaStream()
    mediaRecorderRef.current = null
    chunksRef.current = []
    setIsRecording(false)
    setRecordingSeconds(0)
    setRecordedBlob(null)
    resetPreviewUrl(null)
    setMicError(null)
  }

  const handleStartRecording = async () => {
    setMicError(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError('Запис з мікрофона не підтримується у цьому браузері.')
      return
    }

    try {
      clearRecording()

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        })

        setRecordedBlob(blob)
        resetPreviewUrl(URL.createObjectURL(blob))
        stopMediaStream()
        mediaRecorderRef.current = null
        setIsRecording(false)
      }

      recorder.start()
      setRecordingSeconds(0)
      setIsRecording(true)
    } catch {
      stopMediaStream()
      setMicError('Не вдалося отримати доступ до мікрофона.')
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  const buildRecordedFile = (): File | null => {
    if (!recordedBlob) {
      return null
    }

    return new File([recordedBlob], 'voice-command.webm', {
      type: recordedBlob.type || 'audio/webm',
    })
  }

  const handleProcessFile = () => {
    if (!selectedFile || isProcessing) {
      return
    }

    onProcess(selectedFile)
  }

  const handleSendRecording = () => {
    const file = buildRecordedFile()
    if (!file || isProcessing) {
      return
    }

    onProcess(file)
  }

  return (
    <Stack gap="md">
      <SegmentedControl
        value={mode}
        onChange={(value) => setMode(value as VoiceInputMode)}
        data={[
          { label: 'Завантажити файл', value: 'file' },
          { label: 'Записати з мікрофона', value: 'microphone' },
        ]}
      />

      {mode === 'file' ? (
        <Stack gap="sm">
          <Group align="flex-end" wrap="wrap">
            <FileButton
              accept="audio/*"
              onChange={(file) => setSelectedFile(file)}
              disabled={isProcessing}
            >
              {(props) => (
                <Button
                  {...props}
                  variant="light"
                  leftSection={<IconUpload size={16} />}
                >
                  Обрати аудіофайл
                </Button>
              )}
            </FileButton>

            <Button
              leftSection={<IconPlayerPlay size={16} />}
              onClick={handleProcessFile}
              loading={isProcessing}
              disabled={!selectedFile}
            >
              Обробити аудіо
            </Button>
          </Group>

          <Text size="sm" c={selectedFile ? undefined : 'dimmed'}>
            {selectedFile
              ? `Обрано: ${selectedFile.name}`
              : 'Файл не обрано'}
          </Text>
        </Stack>
      ) : (
        <Stack gap="sm">
          <Group wrap="wrap">
            <Button
              variant="light"
              color="red"
              leftSection={<IconMicrophone size={16} />}
              onClick={() => void handleStartRecording()}
              disabled={isRecording || isProcessing}
            >
              Почати запис
            </Button>

            <Button
              variant="light"
              onClick={handleStopRecording}
              disabled={!isRecording || isProcessing}
            >
              Зупинити запис
            </Button>

            <Button
              leftSection={<IconPlayerPlay size={16} />}
              onClick={handleSendRecording}
              loading={isProcessing}
              disabled={!recordedBlob || isRecording}
            >
              Надіслати запис
            </Button>

            <Button
              variant="subtle"
              color="gray"
              leftSection={<IconTrash size={16} />}
              onClick={clearRecording}
              disabled={isProcessing || (!recordedBlob && !isRecording)}
            >
              Очистити
            </Button>
          </Group>

          <Text size="sm" c={isRecording ? 'red' : 'dimmed'} fw={isRecording ? 600 : 400}>
            {isRecording
              ? `Запис: ${formatRecordingTime(recordingSeconds)}`
              : recordedBlob
                ? `Запис готовий (${formatRecordingTime(recordingSeconds)})`
                : 'Запис не розпочато'}
          </Text>

          {previewUrl ? (
            <audio controls src={previewUrl}>
              <track kind="captions" />
            </audio>
          ) : null}

          {micError ? (
            <Text size="sm" c="red">
              {micError}
            </Text>
          ) : null}
        </Stack>
      )}
    </Stack>
  )
}
