import { Switch, type SwitchProps } from '@mantine/core'
import type { ChangeEvent } from 'react'
import { readCheckboxChecked } from '../../utils/form'

interface FormSwitchProps extends Omit<SwitchProps, 'checked' | 'onChange'> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function FormSwitch({
  checked,
  onCheckedChange,
  ...props
}: FormSwitchProps) {
  return (
    <Switch
      {...props}
      checked={checked}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        onCheckedChange(readCheckboxChecked(event))
      }
    />
  )
}
