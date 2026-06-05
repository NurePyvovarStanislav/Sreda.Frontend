/** ID з бекенду може приходити як number або string у JSON. */
export type EntityId = string | number

export interface ProcessTextCommandRequest {
  text: string
  userId?: EntityId | null
}

export interface ProcessCommandDevice {
  id?: EntityId | null
  code?: string | null
  name?: string | null
  location?: string | null
  isOnline?: boolean | null
  stateJson?: string | null
}

export interface ProcessCommandResponse {
  commandId?: EntityId | null
  userId?: EntityId | null
  rawText?: string | null
  recognizedText?: string | null
  commandCode?: string | null
  commandName?: string | null
  status: string
  message: string
  confidence?: number | null
  deviceCode?: string | null
  deviceStateJson?: string | null
  audioBase64?: string | null
  audioContentType?: string | null
  device?: ProcessCommandDevice | null
}

export interface ResolveCommandRequest {
  text: string
}

export interface ResolveCommandResponse {
  text?: string | null
  rawText?: string | null
  accepted?: boolean | null
  commandCode?: string | null
  commandName?: string | null
  confidence?: number | null
  status?: string | null
  matchKind?: string | null
  matchedPhrase?: string | null
  matchedLanguage?: string | null
}

export interface SpeakRequest {
  text: string
  language?: string | null
}
