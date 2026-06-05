import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import type { DeviceResponse, DeviceType } from '../../types/device'
import { deviceTypeOptions } from '../../utils/display'
import { modalBaseProps, selectInModalProps } from '../../utils/mantine'
import { FormSwitch } from '../common/FormSwitch'

export interface DeviceFormValues {
  code: string
  name: string
  type: string
  location: string
  isActive: boolean
}

interface DeviceFormModalProps {
  opened: boolean
  mode: 'create' | 'edit'
  device?: DeviceResponse | null
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (values: DeviceFormValues) => void
}

const createEmptyValues = (): DeviceFormValues => ({
  code: '',
  name: '',
  type: '1',
  location: '',
  isActive: true,
})

export function DeviceFormModal({
  opened,
  mode,
  device,
  isSubmitting = false,
  onClose,
  onSubmit,
}: DeviceFormModalProps) {
  const [values, setValues] = useState<DeviceFormValues>(createEmptyValues)

  useEffect(() => {
    if (!opened) {
      return
    }

    if (mode === 'edit' && device) {
      setValues({
        code: device.code,
        name: device.name,
        type: String(device.type),
        location: device.location ?? '',
        isActive: device.isActive,
      })
      return
    }

    setValues(createEmptyValues())
  }, [opened, mode, device?.id])

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
      title={mode === 'create' ? 'Новий пристрій' : 'Редагування пристрою'}
      size="lg"
    >
      <Stack gap="md">
        {mode === 'create' ? (
          <TextInput
            label="Код"
            placeholder="Наприклад: living-room-light"
            value={values.code}
            onChange={(event) => {
              const code = event.currentTarget.value
              setValues((current) => ({ ...current, code }))
            }}
            required
          />
        ) : null}

        <TextInput
          label="Назва"
          placeholder="Введіть назву пристрою"
          value={values.name}
          onChange={(event) => {
            const name = event.currentTarget.value
            setValues((current) => ({ ...current, name }))
          }}
          required
        />

        <Select
          label="Тип"
          data={deviceTypeOptions}
          value={values.type}
          onChange={(value) =>
            setValues((current) => ({
              ...current,
              type: value ?? '1',
            }))
          }
          {...selectInModalProps}
        />

        <TextInput
          label="Локація"
          placeholder="Наприклад: Вітальня"
          value={values.location}
          onChange={(event) => {
            const location = event.currentTarget.value
            setValues((current) => ({ ...current, location }))
          }}
        />

        <FormSwitch
          label="Активний"
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

export function buildDeviceLocalizations(name: string, location: string) {
  return [
    {
      language: 'uk',
      name: name.trim(),
      location: location.trim() || null,
    },
  ]
}

export function toDeviceType(value: string): DeviceType {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : value
}
