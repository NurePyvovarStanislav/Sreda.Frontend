import { Button, Group, Modal, Stack, Text } from '@mantine/core'

interface ConfirmDeleteModalProps {
  opened: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onClose: () => void
  isLoading?: boolean
}

export function ConfirmDeleteModal({
  opened,
  title,
  message,
  confirmLabel = 'Видалити',
  onConfirm,
  onClose,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Stack gap="md">
        <Text size="sm">{message}</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isLoading}>
            Скасувати
          </Button>
          <Button color="red" onClick={onConfirm} loading={isLoading}>
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
