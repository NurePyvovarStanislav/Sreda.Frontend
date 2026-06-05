import { Button, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconVolume } from '@tabler/icons-react'
import { useState } from 'react'
import { speak } from '../../api/voiceApi'
import type { ProcessCommandResponse } from '../../types/voice'
import { playBase64Audio, playBlobAudio } from '../../utils/audio'
import { formatNullable } from '../../utils/display'
import { JsonView } from '../common/JsonView'
import { StatusBadge } from '../common/StatusBadge'

export type CommandResultSource = 'text' | 'voice'

interface CommandResultCardProps {
  result: ProcessCommandResponse
  source: CommandResultSource
  submittedText?: string
}

function resolveDeviceCode(result: ProcessCommandResponse): string | null {
  return result.deviceCode ?? result.device?.code ?? null
}

function resolveDeviceStateJson(result: ProcessCommandResponse): string | null {
  return result.deviceStateJson ?? result.device?.stateJson ?? null
}

function formatConfidence(value: number): string {
  const percent = value <= 1 ? value * 100 : value
  return `${percent.toFixed(1)}%`
}

function parseStateJson(value: string | null): unknown {
  if (!value?.trim()) {
    return null
  }

  try {
    return JSON.parse(value) as unknown
  } catch {
    return value
  }
}

export function CommandResultCard({
  result,
  source,
  submittedText,
}: CommandResultCardProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isReplaying, setIsReplaying] = useState(false)

  const recognizedText =
    result.recognizedText ?? result.rawText ?? submittedText ?? null
  const deviceCode = resolveDeviceCode(result)
  const deviceStateJson = resolveDeviceStateJson(result)
  const parsedState = parseStateJson(deviceStateJson)
  const hasSpeechAudio = Boolean(result.audioBase64?.trim())

  const handleSpeakResponse = async () => {
    if (!result.message.trim()) {
      return
    }

    setIsSpeaking(true)

    try {
      const blob = await speak(result.message)
      await playBlobAudio(blob)
    } finally {
      setIsSpeaking(false)
    }
  }

  const handleReplaySpeech = async () => {
    if (!result.audioBase64?.trim()) {
      return
    }

    setIsReplaying(true)

    try {
      await playBase64Audio(result.audioBase64, result.audioContentType)
    } finally {
      setIsReplaying(false)
    }
  }

  return (
    <Card withBorder padding="lg" radius="md">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Title order={4}>Результат команди</Title>
          <StatusBadge status={result.status} />
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {source === 'text' && submittedText ? (
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Введений текст
              </Text>
              <Text size="sm">{submittedText}</Text>
            </Stack>
          ) : null}

          <Stack gap={4}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Розпізнаний текст
            </Text>
            <Text size="sm">{formatNullable(recognizedText)}</Text>
          </Stack>

          <Stack gap={4}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Код команди
            </Text>
            <Text size="sm">{formatNullable(result.commandCode)}</Text>
          </Stack>

          <Stack gap={4}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Назва команди
            </Text>
            <Text size="sm">{formatNullable(result.commandName)}</Text>
          </Stack>

          {result.confidence != null ? (
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Впевненість
              </Text>
              <Text size="sm">{formatConfidence(result.confidence)}</Text>
            </Stack>
          ) : null}

          {deviceCode ? (
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                Код пристрою
              </Text>
              <Text size="sm">{deviceCode}</Text>
            </Stack>
          ) : null}
        </SimpleGrid>

        <Stack gap={4}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            Повідомлення системи
          </Text>
          <Text size="sm">{result.message}</Text>
        </Stack>

        {parsedState != null ? (
          <Stack gap={4}>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Стан пристрою
            </Text>
            <JsonView data={parsedState} maxHeight={200} />
          </Stack>
        ) : null}

        <Group>
          {source === 'text' ? (
            <Button
              variant="light"
              leftSection={<IconVolume size={16} />}
              onClick={() => void handleSpeakResponse()}
              loading={isSpeaking}
              disabled={!result.message.trim()}
            >
              Озвучити відповідь
            </Button>
          ) : null}

          {source === 'voice' && hasSpeechAudio ? (
            <Button
              variant="light"
              leftSection={<IconVolume size={16} />}
              onClick={() => void handleReplaySpeech()}
              loading={isReplaying}
            >
              Відтворити голосову відповідь
            </Button>
          ) : null}
        </Group>
      </Stack>
    </Card>
  )
}
