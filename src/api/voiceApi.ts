import { apiClient } from './client'
import type {
  EntityId,
  ProcessCommandResponse,
  ProcessTextCommandRequest,
  ResolveCommandRequest,
  ResolveCommandResponse,
  SpeakRequest,
} from '../types/voice'

function toQueryUserId(userId?: EntityId | null): number | undefined {
  if (userId == null || userId === '') {
    return undefined
  }

  const parsed = typeof userId === 'number' ? userId : Number(userId)
  return Number.isFinite(parsed) ? parsed : undefined
}

export async function processText(
  request: ProcessTextCommandRequest,
): Promise<ProcessCommandResponse> {
  const { data } = await apiClient.post<ProcessCommandResponse>(
    '/api/voice/process-text',
    {
      text: request.text,
      userId: toQueryUserId(request.userId),
    },
  )

  return data
}

export async function processAudio(
  file: File | Blob,
  userId?: EntityId | null,
): Promise<ProcessCommandResponse> {
  const formData = new FormData()
  formData.append('audio', file)

  const queryUserId = toQueryUserId(userId)

  const { data } = await apiClient.post<ProcessCommandResponse>(
    '/api/voice/process',
    formData,
    {
      params: queryUserId != null ? { userId: queryUserId } : undefined,
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )

  return data
}

export async function resolve(text: string): Promise<ResolveCommandResponse> {
  const request: ResolveCommandRequest = { text }

  const { data } = await apiClient.post<ResolveCommandResponse>(
    '/api/voice/resolve',
    request,
  )

  return data
}

export async function speak(
  text: string,
  language?: string | null,
): Promise<Blob> {
  const request: SpeakRequest = { text, language }

  const { data } = await apiClient.post<Blob>('/api/voice/speak', request, {
    responseType: 'blob',
  })

  return data
}
