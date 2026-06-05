import { Card, Group, Loader, Stack, Table, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { getCommands } from '../../api/commandsApi'
import {
  API_CONNECTION_ERROR_MESSAGE,
  formatDateTime,
  formatNullable,
  isConnectionError,
  parseJsonField,
} from '../../utils/display'
import { ErrorState } from '../common/ErrorState'
import { JsonView } from '../common/JsonView'
import { StatusBadge } from '../common/StatusBadge'

export function CommandsOverview() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['commands', { take: 10 }],
    queryFn: () => getCommands({ take: 10 }),
  })

  return (
    <Card withBorder padding="lg" radius="md" h="100%">
      <Stack gap="md">
        <Title order={4}>Історія команд</Title>

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
                : 'Не вдалося завантажити історію команд.'
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
                    <Table.Th>Текст</Table.Th>
                    <Table.Th>Статус</Table.Th>
                    <Table.Th>Код команди</Table.Th>
                    <Table.Th>Arguments</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.map((command) => {
                    const argumentsData = parseJsonField(command.argumentsJson)

                    return (
                      <Table.Tr key={String(command.id)}>
                        <Table.Td>{formatDateTime(command.createdAt)}</Table.Td>
                        <Table.Td maw={220}>{command.rawText}</Table.Td>
                        <Table.Td>
                          <StatusBadge status={command.status} />
                        </Table.Td>
                        <Table.Td>
                          {formatNullable(command.commandCode)}
                        </Table.Td>
                        <Table.Td maw={220}>
                          {argumentsData != null ? (
                            <JsonView data={argumentsData} maxHeight={120} />
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
              Історія команд порожня.
            </Text>
          )
        ) : null}
      </Stack>
    </Card>
  )
}
