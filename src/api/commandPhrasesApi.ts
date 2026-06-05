import { apiClient } from './client'
import type {
  CommandPhraseResponse,
  CreateCommandPhraseRequest,
  GetCommandPhrasesParams,
  UpdateCommandPhraseRequest,
} from '../types/commandPhrase'
import type { EntityId } from '../types/voice'

function toPathId(id: EntityId): string {
  return String(id)
}

function toQueryId(value?: EntityId | null): number | undefined {
  if (value == null || value === '') {
    return undefined
  }

  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

export async function getCommandPhrases(
  params: GetCommandPhrasesParams = {},
): Promise<CommandPhraseResponse[]> {
  const { data } = await apiClient.get<CommandPhraseResponse[]>(
    '/api/command-phrases',
    {
      params: {
        availableCommandId: toQueryId(params.availableCommandId),
      },
    },
  )

  return data
}

export async function createCommandPhrase(
  request: CreateCommandPhraseRequest,
): Promise<CommandPhraseResponse> {
  const { data } = await apiClient.post<CommandPhraseResponse>(
    '/api/command-phrases',
    {
      ...request,
      availableCommandId: toQueryId(request.availableCommandId),
    },
  )
  return data
}

export async function updateCommandPhrase(
  id: EntityId,
  request: UpdateCommandPhraseRequest,
): Promise<void> {
  await apiClient.put(`/api/command-phrases/${toPathId(id)}`, request)
}

export async function deleteCommandPhrase(id: EntityId): Promise<void> {
  await apiClient.delete(`/api/command-phrases/${toPathId(id)}`)
}
