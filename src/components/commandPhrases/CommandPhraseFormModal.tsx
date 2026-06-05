import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'
import type { AvailableCommandResponse } from '../../types/availableCommand'
import type { CommandPhraseResponse } from '../../types/commandPhrase'
import {
  buildAvailableCommandSelectOptions,
  findAvailableCommandById,
  phraseLanguageOptions,
} from '../../utils/display'
import { modalBaseProps, selectInModalProps } from '../../utils/mantine'
import { FormSwitch } from '../common/FormSwitch'

export interface CommandPhraseFormValues {
  availableCommandId: string
  phrase: string
  language: string
  isActive: boolean
}

interface CommandPhraseFormModalProps {
  opened: boolean
  mode: 'create' | 'edit'
  phrase?: CommandPhraseResponse | null
  commands: AvailableCommandResponse[]
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (values: CommandPhraseFormValues) => void
}

const createEmptyValues = (): CommandPhraseFormValues => ({
  availableCommandId: '',
  phrase: '',
  language: 'uk',
  isActive: true,
})

export function CommandPhraseFormModal({
  opened,
  mode,
  phrase,
  commands,
  isSubmitting = false,
  onClose,
  onSubmit,
}: CommandPhraseFormModalProps) {
  const [values, setValues] = useState<CommandPhraseFormValues>(createEmptyValues)

  const commandOptions = useMemo(
    () => buildAvailableCommandSelectOptions(commands),
    [commands],
  )

  const linkedCommand = useMemo(() => {
    if (mode === 'edit' && phrase) {
      return findAvailableCommandById(commands, phrase.availableCommandId)
    }

    return values.availableCommandId
      ? findAvailableCommandById(commands, values.availableCommandId)
      : undefined
  }, [commands, mode, phrase, values.availableCommandId])

  useEffect(() => {
    if (!opened) {
      return
    }

    if (mode === 'edit' && phrase) {
      setValues({
        availableCommandId: String(phrase.availableCommandId),
        phrase: phrase.phrase,
        language: phrase.language,
        isActive: phrase.isActive,
      })
      return
    }

    setValues({
      ...createEmptyValues(),
      availableCommandId: commands[0] ? String(commands[0].id) : '',
    })
    // commands intentionally omitted: do not reset form while user edits
  }, [opened, mode, phrase?.id])

  const handleSubmit = () => {
    if (!values.phrase.trim()) {
      return
    }

    if (mode === 'create' && !values.availableCommandId) {
      return
    }

    onSubmit(values)
  }

  return (
    <Modal
      {...modalBaseProps}
      opened={opened}
      onClose={onClose}
      title={mode === 'create' ? 'Нова фраза' : 'Редагування фрази'}
      size="lg"
    >
      <Stack gap="md">
        {mode === 'create' ? (
          <Select
            label="Команда"
            placeholder="Оберіть команду"
            data={commandOptions}
            value={values.availableCommandId || null}
            onChange={(value) =>
              setValues((current) => ({
                ...current,
                availableCommandId: value ?? '',
              }))
            }
            searchable
            nothingFoundMessage="Команд не знайдено"
            disabled={commandOptions.length === 0}
            {...selectInModalProps}
          />
        ) : (
          <Stack gap={4}>
            <Text size="sm" fw={500}>
              Команда
            </Text>
            {linkedCommand ? (
              <Text size="sm">
                {linkedCommand.code} — {linkedCommand.name}
              </Text>
            ) : (
              <Text size="sm" c="dimmed">
                ID: {phrase?.availableCommandId}
              </Text>
            )}
          </Stack>
        )}

        <TextInput
          label="Фраза"
          placeholder="Наприклад: увімкни світло"
          value={values.phrase}
          onChange={(event) => {
            const phrase = event.currentTarget.value
            setValues((current) => ({ ...current, phrase }))
          }}
          required
        />

        <Select
          label="Мова"
          data={phraseLanguageOptions}
          value={values.language}
          onChange={(value) =>
            setValues((current) => ({
              ...current,
              language: value ?? 'uk',
            }))
          }
          {...selectInModalProps}
        />

        <FormSwitch
          label="Активна"
          checked={values.isActive}
          onCheckedChange={(isActive) =>
            setValues((current) => ({ ...current, isActive }))
          }
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>
            Скасувати
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={
              !values.phrase.trim() ||
              (mode === 'create' && !values.availableCommandId)
            }
          >
            {mode === 'create' ? 'Створити' : 'Зберегти'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
