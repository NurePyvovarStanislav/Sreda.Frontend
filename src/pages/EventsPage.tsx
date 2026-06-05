import {
  Button,
  Card,
  Group,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core'
import { IconRefresh, IconSearch } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { getEvents } from '../api/eventsApi'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { JsonView } from '../components/common/JsonView'
import { LoadingState } from '../components/common/LoadingState'
import { PageHeader } from '../components/common/PageHeader'
import type { EventType } from '../types/event'
import {
  API_CONNECTION_ERROR_MESSAGE,
  eventTypeFilterOptions,
  formatDateTime,
  formatEventType,
  formatNullable,
  isConnectionError,
  matchesSearch,
  parseJsonField,
  sortByCreatedAtDesc,
} from '../utils/display'

export function EventsPage() {
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [idSearch, setIdSearch] = useState('')

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['events', 'page', typeFilter],
    queryFn: () =>
      getEvents({
        type: typeFilter != null ? (Number(typeFilter) as EventType) : undefined,
        take: 200,
      }),
  })

  const filteredEvents = useMemo(() => {
    if (!data) {
      return []
    }

    const sorted = sortByCreatedAtDesc(data)

    return sorted.filter((event) => {
      const commandId = event.commandId != null ? String(event.commandId) : ''
      const deviceId = event.deviceId != null ? String(event.deviceId) : ''
      const haystack = `${commandId} ${deviceId}`

      return matchesSearch(haystack, idSearch)
    })
  }, [data, idSearch])

  return (
    <Stack gap="lg">
      <PageHeader
        title="Події"
        description="Журнал системних подій: команди, пристрої та помилки."
        actions={
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={() => void refetch()}
            loading={isFetching && !isLoading}
          >
            Оновити
          </Button>
        }
      />

      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Group align="flex-end" grow preventGrowOverflow={false}>
            <Select
              label="Тип події"
              placeholder="Усі типи"
              clearable
              data={eventTypeFilterOptions}
              value={typeFilter}
              onChange={setTypeFilter}
            />
            <TextInput
              label="Пошук"
              placeholder="CommandId або DeviceId…"
              leftSection={<IconSearch size={16} />}
              value={idSearch}
              onChange={(event) => setIdSearch(event.currentTarget.value)}
            />
          </Group>

          {isLoading ? <LoadingState message="Завантаження подій…" /> : null}

          {isError ? (
            <ErrorState
              message={
                isConnectionError(error)
                  ? API_CONNECTION_ERROR_MESSAGE
                  : 'Не вдалося завантажити події.'
              }
              onRetry={() => void refetch()}
            />
          ) : null}

          {!isLoading && !isError && filteredEvents.length === 0 ? (
            <EmptyState
              message={
                data && data.length > 0
                  ? 'За вашими фільтрами подій не знайдено.'
                  : 'Подій поки немає.'
              }
            />
          ) : null}

          {!isLoading && !isError && filteredEvents.length > 0 ? (
            <Table.ScrollContainer minWidth={960}>
              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Час</Table.Th>
                    <Table.Th>Тип</Table.Th>
                    <Table.Th>CommandId</Table.Th>
                    <Table.Th>DeviceId</Table.Th>
                    <Table.Th>Payload</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredEvents.map((event) => {
                    const payload = parseJsonField(event.payloadJson)

                    return (
                      <Table.Tr key={String(event.id)}>
                        <Table.Td>{formatDateTime(event.createdAt)}</Table.Td>
                        <Table.Td>{formatEventType(event.type)}</Table.Td>
                        <Table.Td>
                          {formatNullable(
                            event.commandId != null
                              ? String(event.commandId)
                              : null,
                          )}
                        </Table.Td>
                        <Table.Td>
                          {formatNullable(
                            event.deviceId != null
                              ? String(event.deviceId)
                              : null,
                          )}
                        </Table.Td>
                        <Table.Td maw={320}>
                          {payload != null ? (
                            <JsonView data={payload} maxHeight={160} />
                          ) : (
                            <Text size="sm" c="dimmed">
                              —
                            </Text>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    )
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          ) : null}
        </Stack>
      </Card>
    </Stack>
  )
}
