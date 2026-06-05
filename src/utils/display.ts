import axios from 'axios'
import type { CommandStatus } from '../types/command'

export function formatDateTime(value?: string | null): string {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function parseJsonField(value?: string | null): unknown {
  if (value == null || value.trim() === '') {
    return null
  }

  try {
    return JSON.parse(value) as unknown
  } catch {
    return value
  }
}

export function formatNullable(value?: string | null): string {
  if (value == null || value.trim() === '') {
    return '—'
  }

  return value
}

const deviceTypeLabels: Record<number, string> = {
  0: 'Невідомий',
  1: 'Світло',
  2: 'Датчик',
  3: 'Вимикач',
  4: 'Замок',
  5: 'Камера',
  6: 'Термостат',
  7: 'Динамік',
}

export function formatDeviceType(type: string | number): string {
  if (typeof type === 'number') {
    return deviceTypeLabels[type] ?? String(type)
  }

  const parsed = Number(type)
  if (Number.isFinite(parsed) && deviceTypeLabels[parsed]) {
    return deviceTypeLabels[parsed]
  }

  return type
}

const eventTypeLabels: Record<number, string> = {
  0: 'SystemStarted',
  1: 'VoiceRecognized',
  2: 'CommandReceived',
  3: 'CommandExecuted',
  4: 'CommandRejected',
  5: 'DeviceUpdated',
  6: 'DeviceHeartbeat',
  7: 'DeviceOffline',
  8: 'Error',
}

export function formatEventType(type: string | number): string {
  if (typeof type === 'number') {
    return eventTypeLabels[type] ?? String(type)
  }

  const parsed = Number(type)
  if (Number.isFinite(parsed) && eventTypeLabels[parsed]) {
    return eventTypeLabels[parsed]
  }

  return type
}

const commandStatusLabels: Record<number, string> = {
  0: 'Pending',
  1: 'Success',
  2: 'Failed',
  3: 'Rejected',
}

export function formatCommandStatus(status: CommandStatus): string {
  if (typeof status === 'number') {
    return commandStatusLabels[status] ?? String(status)
  }

  const parsed = Number(status)
  if (Number.isFinite(parsed) && commandStatusLabels[parsed]) {
    return commandStatusLabels[parsed]
  }

  return status
}

export function normalizeStatusKey(status: string | number): string {
  if (typeof status === 'number') {
    const mapped = commandStatusLabels[status]
    return mapped?.toLowerCase() ?? String(status)
  }

  const parsed = Number(status)
  if (Number.isFinite(parsed) && commandStatusLabels[parsed]) {
    return commandStatusLabels[parsed].toLowerCase()
  }

  return status.toLowerCase()
}

export function isConnectionError(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response
}

export const API_CONNECTION_ERROR_MESSAGE =
  'Не вдалося підключитися до API Sreda. Перевірте, чи запущено backend.'

export function matchesSearch(value: string, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) {
    return true
  }

  return value.toLowerCase().includes(normalizedQuery)
}

export function sortByCreatedAtDesc<T extends { createdAt: string }>(
  items: T[],
): T[] {
  return [...items].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  )
}

export const eventTypeFilterOptions = Object.entries(eventTypeLabels).map(
  ([value, label]) => ({
    value,
    label,
  }),
)

export const commandStatusFilterOptions = Object.entries(commandStatusLabels).map(
  ([value, label]) => ({
    value,
    label,
  }),
)

const accessLevelLabels: Record<number, string> = {
  0: 'Guest',
  1: 'User',
  2: 'Trusted',
  3: 'Admin',
}

export const accessLevelOptions = Object.entries(accessLevelLabels).map(
  ([value, label]) => ({
    value,
    label,
  }),
)

export function formatAccessLevel(level: string | number): string {
  if (typeof level === 'number') {
    return accessLevelLabels[level] ?? String(level)
  }

  const parsed = Number(level)
  if (Number.isFinite(parsed) && accessLevelLabels[parsed]) {
    return accessLevelLabels[parsed]
  }

  return level
}

export const deviceTypeOptions = Object.entries(deviceTypeLabels).map(
  ([value, label]) => ({
    value,
    label,
  }),
)

const commandCategoryLabels: Record<number, string> = {
  0: 'System',
  1: 'Information',
  2: 'Device',
  3: 'Media',
  4: 'Security',
  5: 'Automation',
}

export const commandCategoryOptions = Object.entries(commandCategoryLabels).map(
  ([value, label]) => ({
    value,
    label,
  }),
)

export function formatCommandCategory(category: string | number): string {
  if (typeof category === 'number') {
    return commandCategoryLabels[category] ?? String(category)
  }

  const parsed = Number(category)
  if (Number.isFinite(parsed) && commandCategoryLabels[parsed]) {
    return commandCategoryLabels[parsed]
  }

  return category
}

export const phraseLanguageOptions = [
  { value: 'uk', label: 'Українська (uk)' },
  { value: 'ru', label: 'Російська (ru)' },
  { value: 'en', label: 'English (en)' },
]

export function buildAvailableCommandSelectOptions(
  commands: { id: string | number; code: string; name: string }[],
) {
  return commands.map((command) => ({
    value: String(command.id),
    label: `${command.code} — ${command.name}`,
  }))
}

export function findAvailableCommandById<
  T extends { id: string | number; code: string; name: string },
>(commands: T[] | undefined, id: string | number): T | undefined {
  return commands?.find((command) => String(command.id) === String(id))
}
