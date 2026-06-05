import { Card, Stack, Text } from '@mantine/core'
import { PageHeader } from '../components/common/PageHeader'

export function CommandPhrasesPage() {
  return (
    <Stack gap="lg">
      <PageHeader
        title="Фрази команд"
        description="Приклади фраз для розпізнавання intent-ів."
      />

      <Card withBorder padding="lg" radius="md">
        <Text size="sm" c="dimmed">
          Тут з’явиться список фраз команд після інтеграції з API.
        </Text>
      </Card>
    </Stack>
  )
}
