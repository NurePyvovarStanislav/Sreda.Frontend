import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <Center mih="100vh">
      <Stack align="center" gap="md">
        <Title order={1}>404</Title>
        <Text c="dimmed">Сторінку не знайдено</Text>
        <Button component={Link} to="/" variant="light">
          На головну
        </Button>
      </Stack>
    </Center>
  )
}
