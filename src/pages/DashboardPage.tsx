import { Card, SimpleGrid, Stack, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { processAudioWithSpeech, processText } from '../api/voiceApi'
import { PageHeader } from '../components/common/PageHeader'
import {
  CommandResultCard,
  type CommandResultSource,
} from '../components/dashboard/CommandResultCard'
import { CommandsOverview } from '../components/dashboard/CommandsOverview'
import { DevicesOverview } from '../components/dashboard/DevicesOverview'
import { EventsOverview } from '../components/dashboard/EventsOverview'
import { TextCommandPanel } from '../components/dashboard/TextCommandPanel'
import { VoiceCommandPanel } from '../components/dashboard/VoiceCommandPanel'
import type { ProcessCommandResponse } from '../types/voice'
import { playBase64Audio } from '../utils/audio'
import { normalizeStatusKey } from '../utils/display'

export function DashboardPage() {
  const queryClient = useQueryClient()
  const [submittedText, setSubmittedText] = useState('')
  const [commandResult, setCommandResult] =
    useState<ProcessCommandResponse | null>(null)
  const [resultSource, setResultSource] =
    useState<CommandResultSource>('text')

  const invalidateOverviewQueries = () => {
    void queryClient.invalidateQueries({ queryKey: ['devices'] })
    void queryClient.invalidateQueries({ queryKey: ['events'] })
    void queryClient.invalidateQueries({ queryKey: ['commands'] })
  }

  const showCommandNotification = (result: ProcessCommandResponse) => {
    const statusKey = normalizeStatusKey(result.status)

    if (statusKey === 'success') {
      notifications.show({
        title: 'Команда виконана',
        message: result.message,
        color: 'green',
      })
      return
    }

    if (statusKey === 'failed' || statusKey === 'rejected') {
      notifications.show({
        title: 'Команда не виконана',
        message: result.message,
        color: statusKey === 'failed' ? 'red' : 'orange',
      })
      return
    }

    notifications.show({
      title: 'Відповідь системи',
      message: result.message,
      color: 'blue',
    })
  }

  const handleCommandSuccess = (
    result: ProcessCommandResponse,
    source: CommandResultSource,
    text?: string,
  ) => {
    if (text) {
      setSubmittedText(text)
    } else {
      setSubmittedText('')
    }

    setResultSource(source)
    setCommandResult(result)
    invalidateOverviewQueries()
    showCommandNotification(result)
  }

  const textCommandMutation = useMutation({
    mutationFn: (text: string) => processText({ text }),
    onSuccess: (result, text) => {
      handleCommandSuccess(result, 'text', text)
    },
  })

  const voiceCommandMutation = useMutation({
    mutationFn: (file: File) => processAudioWithSpeech(file),
    onSuccess: async (result) => {
      handleCommandSuccess(result, 'voice')

      if (result.audioBase64?.trim()) {
        try {
          await playBase64Audio(result.audioBase64, result.audioContentType)
        } catch {
          notifications.show({
            title: 'Аудіо',
            message: 'Не вдалося автоматично відтворити голосову відповідь.',
            color: 'yellow',
          })
        }
      }
    },
  })

  return (
    <Stack gap="lg">
      <PageHeader
        title="Головна панель"
        description="Надішліть текстову або голосову команду та перегляньте результат у системі Sreda в реальному часі."
      />

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Card withBorder padding="lg" radius="md">
          <Stack gap="md">
            <Title order={4}>Текстова команда</Title>
            <TextCommandPanel
              onSubmit={(text) => textCommandMutation.mutate(text)}
              isLoading={textCommandMutation.isPending}
            />
          </Stack>
        </Card>

        <Card withBorder padding="lg" radius="md">
          <Stack gap="md">
            <Title order={4}>Голосова команда</Title>
            <VoiceCommandPanel
              onProcess={(file) => voiceCommandMutation.mutate(file)}
              isProcessing={voiceCommandMutation.isPending}
            />
          </Stack>
        </Card>
      </SimpleGrid>

      {commandResult ? (
        <CommandResultCard
          result={commandResult}
          source={resultSource}
          submittedText={submittedText}
        />
      ) : null}

      <DevicesOverview />

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <EventsOverview />
        <CommandsOverview />
      </SimpleGrid>
    </Stack>
  )
}
