import { apiClient } from './client'
import type {
  CreateDeviceRequest,
  DeviceResponse,
  DeviceStateResponse,
  UpdateDeviceRequest,
  UpdateDeviceStateRequest,
} from '../types/device'
import type { EntityId } from '../types/voice'

function toPathId(id: EntityId): string {
  return String(id)
}

export async function getDevices(): Promise<DeviceResponse[]> {
  const { data } = await apiClient.get<DeviceResponse[]>('/api/devices')
  return data
}

export async function getDevice(id: EntityId): Promise<DeviceResponse> {
  const { data } = await apiClient.get<DeviceResponse>(
    `/api/devices/${toPathId(id)}`,
  )
  return data
}

export async function createDevice(
  request: CreateDeviceRequest,
): Promise<DeviceResponse> {
  const { data } = await apiClient.post<DeviceResponse>(
    '/api/devices',
    request,
  )
  return data
}

export async function updateDevice(
  id: EntityId,
  request: UpdateDeviceRequest,
): Promise<void> {
  await apiClient.put(`/api/devices/${toPathId(id)}`, request)
}

export async function deleteDevice(id: EntityId): Promise<void> {
  await apiClient.delete(`/api/devices/${toPathId(id)}`)
}

export async function getDeviceState(
  id: EntityId,
): Promise<DeviceStateResponse> {
  const { data } = await apiClient.get<DeviceStateResponse>(
    `/api/devices/${toPathId(id)}/state`,
  )
  return data
}

export async function updateDeviceState(
  id: EntityId,
  request: UpdateDeviceStateRequest,
): Promise<DeviceStateResponse> {
  const { data } = await apiClient.put<DeviceStateResponse>(
    `/api/devices/${toPathId(id)}/state`,
    request,
  )
  return data
}
