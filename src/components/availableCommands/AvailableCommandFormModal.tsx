import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import type { AvailableCommandResponse } from '../../types/availableCommand'
import { accessLevelOptions, commandCategoryOptions } from '../../utils/display'
import { modalBaseProps, selectInModalProps } from '../../utils/mantine'
import { FormSwitch } from '../common/FormSwitch'

export interface AvailableCommandFormValues {
  code: string
  name: string
  description: string
  category: string
  requiredAccessLevel: string
  requiresDevice: boolean
  isEnabled: boolean
}

interface AvailableCommandFormModalProps {
  opened: boolean
  mode: 'create' | 'edit'
  command?: AvailableCommandResponse | null
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (values: AvailableCommandFormValues) => void
}

const createEmptyValues = (): AvailableCommandFormValues => ({
  code: '',
  name: '',
  description: '',
  category: '2',
  requiredAccessLevel: '1',
  requiresDevice: false,
  isEnabled: true,
})

export function AvailableCommandFormModal({
  opened,
  mode,
  command,
  isSubmitting = false,
  onClose,
  onSubmit,
}: AvailableCommandFormModalProps) {
  const [values, setValues] = useState<AvailableCommandFormValues>(createEmptyValues)

  useEffect(() => {
    if (!opened) {
      return
    }

    if (mode === 'edit' && command) {
      setValues({
        code: command.code,
        name: command.name,
        description: command.description ?? '',
        category: String(command.category),
        requiredAccessLevel: String(command.requiredAccessLevel),
        requiresDevice: command.requiresDevice,
        isEnabled: command.isEnabled,
      })
      return
    }

    setValues(createEmptyValues())
  }, [opened, mode, command?.id])

  const handleSubmit = () => {
    if (!values.name.trim()) {
      return
    }

    if (mode === 'create' && !values.code.trim()) {
      return
    }

    onSubmit(values)
  }

  return (
    <Modal
      {...modalBaseProps}
      opened={opened}
      onClose={onClose}
      title={mode === 'create' ? 'Нова команда' : 'Редагування команди'}
      size="lg"
    >
      <Stack gap="md">
        {mode === 'edit' && command ? (
          <Stack gap={4}>
            <Text size="sm" fw={500}>
              Код
            </Text>
            <Text size="sm" c="dimmed">
              {command.code}
            </Text>
          </Stack>
        ) : (
          <TextInput
            label="Код"
            placeholder="Наприклад: TurnOnLight"
            value={values.code}
            onChange={(event) => {
              const code = event.currentTarget.value
              setValues((current) => ({ ...current, code }))
            }}
            required
          />
        )}

        <TextInput
          label="Назва"
          placeholder="Введіть назву команди"
          value={values.name}
          onChange={(event) => {
            const name = event.currentTarget.value
            setValues((current) => ({ ...current, name }))
          }}
          required
        />

        <Textarea
          label="Опис"
          placeholder="Короткий опис команди"
          minRows={2}
          autosize
          value={values.description}
          onChange={(event) => {
            const description = event.currentTarget.value
            setValues((current) => ({ ...current, description }))
          }}
        />

        <Select
          label="Категорія"
          data={commandCategoryOptions}
          value={values.category}
          onChange={(value) =>
            setValues((current) => ({
              ...current,
              category: value ?? '2',
            }))
          }
          {...selectInModalProps}
        />

        <Select
          label="Необхідний рівень доступу"
          data={accessLevelOptions}
          value={values.requiredAccessLevel}
          onChange={(value) =>
            setValues((current) => ({
              ...current,
              requiredAccessLevel: value ?? '1',
            }))
          }
          {...selectInModalProps}
        />

        <FormSwitch
          label="Потребує пристрій"
          checked={values.requiresDevice}
          onCheckedChange={(requiresDevice) =>
            setValues((current) => ({ ...current, requiresDevice }))
          }
        />

        <FormSwitch
          label="Увімкнена"
          checked={values.isEnabled}
          onCheckedChange={(isEnabled) =>
            setValues((current) => ({ ...current, isEnabled }))
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
              !values.name.trim() ||
              (mode === 'create' && !values.code.trim())
            }
          >
            {mode === 'create' ? 'Створити' : 'Зберегти'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
