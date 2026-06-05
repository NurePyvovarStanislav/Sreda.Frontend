import type { AccessLevel } from './user'
import type { EntityId } from './voice'

/** System=0, Information=1, Device=2, Media=3, Security=4, Automation=5 */
export type CommandCategory = string | number

export interface AvailableCommandResponse {
  id: EntityId
  code: string
  name: string
  description?: string | null
  category: CommandCategory
  requiresDevice: boolean
  requiredAccessLevel: AccessLevel
  isEnabled: boolean
  createdAt?: string | null
}

export interface CreateAvailableCommandRequest {
  code: string
  name: string
  description?: string | null
  category: CommandCategory
  requiresDevice: boolean
  requiredAccessLevel: AccessLevel
  isEnabled?: boolean
}

export interface UpdateAvailableCommandRequest {
  name: string
  description?: string | null
  category: CommandCategory
  requiresDevice: boolean
  requiredAccessLevel: AccessLevel
  isEnabled: boolean
}
