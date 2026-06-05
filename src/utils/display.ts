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
