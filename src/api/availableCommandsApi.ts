import { apiClient } from './client'
import type {
  AvailableCommandResponse,
  CreateAvailableCommandRequest,
  UpdateAvailableCommandRequest,
} from '../types/availableCommand'
import type { EntityId } from '../types/voice'

function toPathId(id: EntityId): string {
  return String(id)
}

export async function getAvailableCommands(): Promise<
  AvailableCommandResponse[]
> {
  const { data } = await apiClient.get<AvailableCommandResponse[]>(
    '/api/available-commands',
  )
  return data
}

export async function getAvailableCommand(
  id: EntityId,
): Promise<AvailableCommandResponse> {
  const { data } = await apiClient.get<AvailableCommandResponse>(
    `/api/available-commands/${toPathId(id)}`,
  )
  return data
}

export async function createAvailableCommand(
  request: CreateAvailableCommandRequest,
): Promise<AvailableCommandResponse> {
  const { data } = await apiClient.post<AvailableCommandResponse>(
    '/api/available-commands',
    request,
  )
  return data
}

export async function updateAvailableCommand(
  id: EntityId,
  request: UpdateAvailableCommandRequest,
): Promise<void> {
  await apiClient.put(
    `/api/available-commands/${toPathId(id)}`,
    request,
  )
}

export async function deleteAvailableCommand(id: EntityId): Promise<void> {
  await apiClient.delete(`/api/available-commands/${toPathId(id)}`)
}
