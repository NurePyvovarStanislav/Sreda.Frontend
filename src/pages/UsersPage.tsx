import { Card, Stack, Text } from '@mantine/core'
import { PageHeader } from '../components/common/PageHeader'

export function UsersPage() {
  return (
    <Stack gap="lg">
      <PageHeader
        title="Користувачі"
        description="Керування користувачами системи Sreda."
      />

      <Card withBorder padding="lg" radius="md">
        <Text size="sm" c="dimmed">
          Тут з’явиться список користувачів після інтеграції з API.
        </Text>
      </Card>
    </Stack>
  )
}
