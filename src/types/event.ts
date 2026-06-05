import type { EntityId } from './voice'

/** SystemStarted=0 … Error=8 */
export type EventType = string | number

export interface EventResponse {
  id: EntityId
  type: EventType
  commandId?: EntityId | null
  deviceId?: EntityId | null
  payloadJson?: string | null
  createdAt: string
}

export interface GetEventsParams {
  type?: EventType | null
  commandId?: EntityId | null
  deviceId?: EntityId | null
  skip?: number
  take?: number
}
