import type { EntityId } from './voice'

/** Unknown=0, Light=1, Sensor=2, Switch=3, Lock=4, Camera=5, Thermostat=6, Speaker=7 */
export type DeviceType = string | number

export interface DeviceLocalization {
  language: string
  name: string
  location?: string | null
}

export interface DeviceResponse {
  id: EntityId
  code: string
  name: string
  type: DeviceType
  location?: string | null
  isActive: boolean
  isOnline?: boolean | null
  stateJson?: string | null
  updatedAt?: string | null
  createdAt?: string | null
  localizations?: DeviceLocalization[] | null
}

export interface CreateDeviceRequest {
  code: string
  localizations: DeviceLocalization[]
  type: DeviceType
  isActive?: boolean
}

export interface UpdateDeviceRequest {
  localizations: DeviceLocalization[]
  type: DeviceType
  isActive: boolean
}

export interface DeviceStateResponse {
  deviceId: EntityId
  isOnline: boolean
  lastSeenAt?: string | null
  stateJson?: string | null
  updatedAt: string
}

export interface UpdateDeviceStateRequest {
  isOnline: boolean
  stateJson?: string | null
}
