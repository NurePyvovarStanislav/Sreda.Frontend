import type { EntityId } from './voice'

/** Guest=0, User=1, Trusted=2, Admin=3 */
export type AccessLevel = string | number

export interface UserResponse {
  id: EntityId
  name: string
  isActive: boolean
  accessLevel: AccessLevel
  createdAt: string
}

export interface CreateUserRequest {
  name: string
  accessLevel: AccessLevel
  isActive?: boolean
}

export interface UpdateUserRequest {
  name: string
  accessLevel: AccessLevel
  isActive: boolean
}
