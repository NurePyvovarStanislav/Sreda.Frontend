export const selectInModalProps = {
  comboboxProps: { withinPortal: false },
} as const

export const modalBaseProps = {
  centered: true,
  closeOnClickOutside: false,
  trapFocus: false,
  returnFocus: false,
} as const
