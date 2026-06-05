import { Alert, Button, Stack } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Помилка',
  message = 'Не вдалося завантажити дані.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Alert
      icon={<IconAlertCircle size={18} />}
      title={title}
      color="red"
      variant="light"
    >
      <Stack gap="sm">
        {message}
        {onRetry ? (
          <Button variant="light" color="red" size="xs" onClick={onRetry}>
            Спробувати знову
          </Button>
        ) : null}
      </Stack>
    </Alert>
  )
}
