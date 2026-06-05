import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import type { UserResponse } from '../../types/user'
import { accessLevelOptions } from '../../utils/display'
import { modalBaseProps, selectInModalProps } from '../../utils/mantine'
import { FormSwitch } from '../common/FormSwitch'

export interface UserFormValues {
  name: string
  accessLevel: string
  isActive: boolean
}

interface UserFormModalProps {
  opened: boolean
  mode: 'create' | 'edit'
  user?: UserResponse | null
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (values: UserFormValues) => void
}

function createEmptyValues(): UserFormValues {
  return {
    name: '',
    accessLevel: '1',
    isActive: true,
  }
}

export function UserFormModal({
  opened,
  mode,
  user,
  isSubmitting = false,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const [values, setValues] = useState<UserFormValues>(createEmptyValues)

  useEffect(() => {
    if (!opened) {
      return
    }

    if (mode === 'edit' && user) {
      setValues({
        name: user.name,
        accessLevel: String(user.accessLevel),
        isActive: user.isActive,
      })
      return
    }

    setValues(createEmptyValues())
  }, [opened, mode, user?.id])

  const handleSubmit = () => {
    if (!values.name.trim()) {
      return
    }

    onSubmit(values)
  }

  return (
    <Modal
      {...modalBaseProps}
      opened={opened}
      onClose={onClose}
      title={mode === 'create' ? 'Новий користувач' : 'Редагування користувача'}
    >
      <Stack gap="md">
        <TextInput
          label="Ім’я"
          placeholder="Введіть ім’я користувача"
          value={values.name}
          onChange={(event) => {
            const name = event.currentTarget.value
            setValues((current) => ({ ...current, name }))
          }}
          required
        />

        <Select
          label="Рівень доступу"
          data={accessLevelOptions}
          value={values.accessLevel}
          onChange={(value) =>
            setValues((current) => ({
              ...current,
              accessLevel: value ?? '1',
            }))
          }
          {...selectInModalProps}
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
            disabled={!values.name.trim()}
          >
            {mode === 'create' ? 'Створити' : 'Зберегти'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
