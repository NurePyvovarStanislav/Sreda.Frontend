import { apiClient } from './client'
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../types/user'
import type { EntityId } from '../types/voice'

function toPathId(id: EntityId): string {
  return String(id)
}

export async function getUsers(): Promise<UserResponse[]> {
  const { data } = await apiClient.get<UserResponse[]>('/api/users')
  return data
}

export async function createUser(
  request: CreateUserRequest,
): Promise<UserResponse> {
  const { data } = await apiClient.post<UserResponse>('/api/users', request)
  return data
}

export async function updateUser(
  id: EntityId,
  request: UpdateUserRequest,
): Promise<void> {
  await apiClient.put(`/api/users/${toPathId(id)}`, request)
}

export async function deleteUser(id: EntityId): Promise<void> {
  await apiClient.delete(`/api/users/${toPathId(id)}`)
}
