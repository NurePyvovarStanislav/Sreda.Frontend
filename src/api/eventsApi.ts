import { apiClient } from './client'
import type { EntityId } from '../types/voice'
import type { EventResponse, GetEventsParams } from '../types/event'

function toQueryId(value?: EntityId | null): number | undefined {
  if (value == null || value === '') {
    return undefined
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function toQueryType(value?: GetEventsParams['type']): number | string | undefined {
  if (value == null || value === '') {
    return undefined
  }

  if (typeof value === 'number') {
    return value
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : value
}

export async function getEvents(
  params: GetEventsParams = {},
): Promise<EventResponse[]> {
  const { data } = await apiClient.get<EventResponse[]>('/api/events', {
    params: {
      type: toQueryType(params.type),
      commandId: toQueryId(params.commandId),
      deviceId: toQueryId(params.deviceId),
      skip: params.skip,
      take: params.take,
    },
  })

  return data
}
