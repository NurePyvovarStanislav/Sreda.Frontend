import { Card, SimpleGrid, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { processText } from '../api/voiceApi'
import { PageHeader } from '../components/common/PageHeader'
import { CommandResultCard } from '../components/dashboard/CommandResultCard'
import { CommandsOverview } from '../components/dashboard/CommandsOverview'
import { DevicesOverview } from '../components/dashboard/DevicesOverview'
import { EventsOverview } from '../components/dashboard/EventsOverview'
import { TextCommandPanel } from '../components/dashboard/TextCommandPanel'
import type { ProcessCommandResponse } from '../types/voice'
import { normalizeStatusKey } from '../utils/display'

export function DashboardPage() {
  const queryClient = useQueryClient()
  const [submittedText, setSubmittedText] = useState('')
  const [commandResult, setCommandResult] =
    useState<ProcessCommandResponse | null>(null)

  const commandMutation = useMutation({
    mutationFn: (text: string) => processText({ text }),
    onSuccess: (result, text) => {
      setSubmittedText(text)
      setCommandResult(result)

      void queryClient.invalidateQueries({ queryKey: ['devices'] })
      void queryClient.invalidateQueries({ queryKey: ['events'] })
      void queryClient.invalidateQueries({ queryKey: ['commands'] })

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
    },
  })

  return (
    <Stack gap="lg">
      <PageHeader
        title="Головна панель"
        description="Введіть текстову команду та перегляньте результат у системі Sreda в реальному часі."
      />

      <Card withBorder padding="lg" radius="md">
        <TextCommandPanel
          onSubmit={(text) => commandMutation.mutate(text)}
          isLoading={commandMutation.isPending}
        />
      </Card>

      {commandResult ? (
        <CommandResultCard
          submittedText={submittedText}
          result={commandResult}
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
