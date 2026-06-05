import { Badge } from '@mantine/core'

type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

interface StatusBadgeProps {
  status: string
  variant?: StatusVariant
}

const variantColors: Record<StatusVariant, string> = {
  success: 'green',
  warning: 'yellow',
  error: 'red',
  info: 'blue',
  neutral: 'gray',
}

export function StatusBadge({ status, variant = 'neutral' }: StatusBadgeProps) {
  return (
    <Badge variant="light" color={variantColors[variant]} radius="sm">
      {status}
    </Badge>
  )
}
