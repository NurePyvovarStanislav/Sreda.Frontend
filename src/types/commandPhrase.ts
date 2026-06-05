import type { EntityId } from './voice'

export interface CommandPhraseResponse {
  id: EntityId
  availableCommandId: EntityId
  phrase: string
  language: string
  isActive: boolean
}

export interface GetCommandPhrasesParams {
  availableCommandId?: EntityId | null
}

export interface CreateCommandPhraseRequest {
  availableCommandId: EntityId
  phrase: string
  language: string
  isActive?: boolean
}

export interface UpdateCommandPhraseRequest {
  phrase: string
  language: string
  isActive: boolean
}
