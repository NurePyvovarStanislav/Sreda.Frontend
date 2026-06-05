import { apiClient } from './client'
import type {
  CommandHistoryResponse,
  GetCommandsParams,
} from '../types/command'
import type { EntityId } from '../types/voice'

function toQueryId(value?: EntityId | null): number | undefined {
  if (value == null || value === '') {
    return undefined
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function toQueryStatus(
  value?: GetCommandsParams['status'],
): number | string | undefined {
  if (value == null || value === '') {
    return undefined
  }

  if (typeof value === 'number') {
    return value
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : value
}

export async function getCommands(
  params: GetCommandsParams = {},
): Promise<CommandHistoryResponse[]> {
  const { data } = await apiClient.get<CommandHistoryResponse[]>(
    '/api/commands',
    {
      params: {
        userId: toQueryId(params.userId),
        status: toQueryStatus(params.status),
        skip: params.skip,
        take: params.take,
      },
    },
  )

  return data
}
