import {
  Button,
  Group,
  Modal,
  Stack,
  Textarea,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import type { DeviceStateResponse } from '../../types/device'
import { modalBaseProps } from '../../utils/mantine'
import { FormSwitch } from '../common/FormSwitch'

export interface DeviceStateFormValues {
  isOnline: boolean
  stateJson: string
}

interface DeviceStateModalProps {
  opened: boolean
  deviceName?: string
  initialState?: DeviceStateResponse | null
  isSubmitting?: boolean
  isLoading?: boolean
  onClose: () => void
  onSubmit: (values: DeviceStateFormValues) => void
}

export function DeviceStateModal({
  opened,
  deviceName,
  initialState,
  isSubmitting = false,
  isLoading = false,
  onClose,
  onSubmit,
}: DeviceStateModalProps) {
  const [values, setValues] = useState<DeviceStateFormValues>({
    isOnline: true,
    stateJson: '',
  })

  useEffect(() => {
    if (!opened) {
      return
    }

    setValues({
      isOnline: initialState?.isOnline ?? true,
      stateJson: initialState?.stateJson ?? '',
    })
  }, [opened, initialState])

  const handleSubmit = () => {
    onSubmit({
      isOnline: values.isOnline,
      stateJson: values.stateJson,
    })
  }

  return (
    <Modal
      {...modalBaseProps}
      opened={opened}
      onClose={onClose}
      title={`Оновити стан${deviceName ? `: ${deviceName}` : ''}`}
      size="lg"
    >
      <Stack gap="md">
        <FormSwitch
          label="Online"
          checked={values.isOnline}
          onCheckedChange={(isOnline) =>
            setValues((current) => ({ ...current, isOnline }))
          }
          disabled={isLoading}
        />

        <Textarea
          label="StateJson"
          description="JSON-об’єкт стану пристрою"
          placeholder='{"power": true}'
          minRows={6}
          autosize
          value={values.stateJson}
          onChange={(event) => {
            const stateJson = event.currentTarget.value
            setValues((current) => ({ ...current, stateJson }))
          }}
          disabled={isLoading}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>
            Скасувати
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting || isLoading}>
            Зберегти стан
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
