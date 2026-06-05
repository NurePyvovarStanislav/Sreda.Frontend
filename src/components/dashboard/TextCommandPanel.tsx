import { Button, Group, Stack, Textarea } from '@mantine/core'
import { IconPlayerPlay } from '@tabler/icons-react'
import { useState, type KeyboardEvent } from 'react'

interface TextCommandPanelProps {
  onSubmit: (text: string) => void
  isLoading?: boolean
}

export function TextCommandPanel({
  onSubmit,
  isLoading = false,
}: TextCommandPanelProps) {
  const [text, setText] = useState('')
  const isEmpty = text.trim().length === 0

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) {
      return
    }

    onSubmit(trimmed)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <Stack gap="md">
      <Textarea
        label="Текстова команда"
        description="Натисніть Ctrl+Enter для швидкого виконання"
        placeholder="Наприклад: увімкни світло"
        minRows={3}
        autosize
        maxRows={6}
        value={text}
        onChange={(event) => setText(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />

      <Group justify="flex-end">
        <Button
          leftSection={<IconPlayerPlay size={16} />}
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isEmpty}
        >
          Виконати команду
        </Button>
      </Group>
    </Stack>
  )
}
