import { Card, Stack, Text } from '@mantine/core'
import { PageHeader } from '../components/common/PageHeader'

export function CommandHistoryPage() {
  return (
    <Stack gap="lg">
      <PageHeader
        title="Історія команд"
        description="Виконані текстові та голосові команди користувачів."
      />

      <Card withBorder padding="lg" radius="md">
        <Text size="sm" c="dimmed">
          Тут з’явиться історія команд після інтеграції з API.
        </Text>
      </Card>
    </Stack>
  )
}
