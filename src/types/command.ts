import type { EntityId } from './voice'

/** Pending=0, Success=1, Failed=2, Rejected=3 */
export type CommandStatus = string | number

export interface CommandHistoryResponse {
  id: EntityId
  userId?: EntityId | null
  rawText: string
  availableCommandId?: EntityId | null
  commandCode?: string | null
  status: CommandStatus
  argumentsJson?: string | null
  createdAt: string
}

export interface GetCommandsParams {
  userId?: EntityId | null
  status?: CommandStatus | null
  skip?: number
  take?: number
}
