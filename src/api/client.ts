import axios, { type AxiosError } from 'axios'
import { notifications } from '@mantine/notifications'

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7186'

export const apiClient = axios.create({
  baseURL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

function getErrorMessage(error: AxiosError): string {
  const data = error.response?.data

  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message: unknown }).message
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  if (error.message) {
    return error.message
  }

  return 'Не вдалося виконати запит'
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    notifications.show({
      title: 'Помилка',
      message: getErrorMessage(error),
      color: 'red',
    })

    return Promise.reject(error)
  },
)
