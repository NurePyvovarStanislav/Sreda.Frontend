import type { ChangeEvent } from 'react'

export function readInputValue(
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
): string {
  return event.currentTarget.value
}

export function readCheckboxChecked(
  event: ChangeEvent<HTMLInputElement>,
): boolean {
  return event.currentTarget.checked
}
