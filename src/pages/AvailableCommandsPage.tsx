import { Card, Stack, Text } from '@mantine/core'
import { PageHeader } from '../components/common/PageHeader'

export function AvailableCommandsPage() {
  return (
    <Stack gap="lg">
      <PageHeader
        title="Каталог команд"
        description="Доступні intent-и та дії, які розуміє система."
      />

      <Card withBorder padding="lg" radius="md">
        <Text size="sm" c="dimmed">
          Тут з’явиться каталог команд після інтеграції з API.
        </Text>
      </Card>
    </Stack>
  )
}
