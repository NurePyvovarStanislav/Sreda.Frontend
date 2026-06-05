import { Card, Text } from '@mantine/core'

interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <Card withBorder padding="xl" radius="md">
      <Text ta="center" c="dimmed" size="sm">
        {message}
      </Text>
    </Card>
  )
}
