import { Center, Loader, Stack, Text } from '@mantine/core'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Завантаження…' }: LoadingStateProps) {
  return (
    <Center py="xl">
      <Stack align="center" gap="md">
        <Loader size="md" />
        <Text c="dimmed" size="sm">
          {message}
        </Text>
      </Stack>
    </Center>
  )
}
