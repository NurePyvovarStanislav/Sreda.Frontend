import { Card, Stack, Text } from '@mantine/core'
import { PageHeader } from '../components/common/PageHeader'

export function EventsPage() {
  return (
    <Stack gap="lg">
      <PageHeader
        title="Події"
        description="Журнал системних подій і змін стану."
      />

      <Card withBorder padding="lg" radius="md">
        <Text size="sm" c="dimmed">
          Тут з’явиться стрічка подій після інтеграції з API.
        </Text>
      </Card>
    </Stack>
  )
}
