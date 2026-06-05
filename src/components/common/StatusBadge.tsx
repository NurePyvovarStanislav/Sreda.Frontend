import { Badge } from '@mantine/core'
import { formatCommandStatus, normalizeStatusKey } from '../../utils/display'

interface StatusBadgeProps {
  status: string | number
}

function resolveStatusColor(status: string | number): string {
  const key = normalizeStatusKey(status)

  switch (key) {
    case 'success':
      return 'green'
    case 'failed':
      return 'red'
    case 'rejected':
      return 'orange'
    case 'unknown':
      return 'gray'
    case 'pending':
      return 'blue'
    default:
      return 'gray'
  }
}

function formatStatusLabel(status: string | number): string {
  if (typeof status === 'string' && Number.isNaN(Number(status))) {
    return status
  }

  return formatCommandStatus(status)
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="light" color={resolveStatusColor(status)} radius="sm">
      {formatStatusLabel(status)}
    </Badge>
  )
}
