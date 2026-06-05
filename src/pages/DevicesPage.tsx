import { Card, Stack, Text } from '@mantine/core'
import { PageHeader } from '../components/common/PageHeader'

export function DevicesPage() {
  return (
    <Stack gap="lg">
      <PageHeader
        title="Пристрої"
        description="Список пристроїв і їхній поточний стан."
      />

      <Card withBorder padding="lg" radius="md">
        <Text size="sm" c="dimmed">
          Тут з’явиться таблиця пристроїв після інтеграції з API.
        </Text>
      </Card>
    </Stack>
  )
}
