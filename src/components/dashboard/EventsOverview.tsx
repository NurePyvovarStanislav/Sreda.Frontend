import { Card, Group, Loader, Stack, Table, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { getEvents } from '../../api/eventsApi'
import {
  API_CONNECTION_ERROR_MESSAGE,
  formatDateTime,
  formatEventType,
  formatNullable,
  isConnectionError,
  parseJsonField,
} from '../../utils/display'
import { ErrorState } from '../common/ErrorState'
import { JsonView } from '../common/JsonView'

export function EventsOverview() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['events', { take: 10 }],
    queryFn: () => getEvents({ take: 10 }),
  })

  return (
    <Card withBorder padding="lg" radius="md" h="100%">
      <Stack gap="md">
        <Title order={4}>Останні події</Title>

        {isLoading ? (
          <Group justify="center" py="md">
            <Loader size="sm" />
          </Group>
        ) : null}

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

        {!isLoading && !isError ? (
          data && data.length > 0 ? (
            <Table.ScrollContainer minWidth={600}>
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
                  {data.map((event) => {
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
                        <Table.Td maw={240}>
                          {payload != null ? (
                            <JsonView data={payload} maxHeight={120} />
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
          ) : (
            <Text size="sm" c="dimmed">
              Подій поки немає.
            </Text>
          )
        ) : null}
      </Stack>
    </Card>
  )
}
