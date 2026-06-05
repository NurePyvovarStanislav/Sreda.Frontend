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
import { getCommands } from '../api/commandsApi'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { JsonView } from '../components/common/JsonView'
import { LoadingState } from '../components/common/LoadingState'
import { PageHeader } from '../components/common/PageHeader'
import { StatusBadge } from '../components/common/StatusBadge'
import type { CommandStatus } from '../types/command'
import {
  API_CONNECTION_ERROR_MESSAGE,
  commandStatusFilterOptions,
  formatDateTime,
  formatNullable,
  isConnectionError,
  matchesSearch,
  parseJsonField,
  sortByCreatedAtDesc,
} from '../utils/display'

export function CommandHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [textSearch, setTextSearch] = useState('')

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['commands', 'page', statusFilter],
    queryFn: () =>
      getCommands({
        status:
          statusFilter != null ? (Number(statusFilter) as CommandStatus) : undefined,
        take: 200,
      }),
  })

  const filteredCommands = useMemo(() => {
    if (!data) {
      return []
    }

    const sorted = sortByCreatedAtDesc(data)

    return sorted.filter((command) => matchesSearch(command.rawText, textSearch))
  }, [data, textSearch])

  return (
    <Stack gap="lg">
      <PageHeader
        title="Історія команд"
        description="Журнал розпізнаних текстових та голосових команд користувачів."
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
              label="Статус"
              placeholder="Усі статуси"
              clearable
              data={commandStatusFilterOptions}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <TextInput
              label="Пошук"
              placeholder="Текст команди…"
              leftSection={<IconSearch size={16} />}
              value={textSearch}
              onChange={(event) => setTextSearch(event.currentTarget.value)}
            />
          </Group>

          {isLoading ? (
            <LoadingState message="Завантаження історії команд…" />
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

          {!isLoading && !isError && filteredCommands.length === 0 ? (
            <EmptyState
              message={
                data && data.length > 0
                  ? 'За вашими фільтрами команд не знайдено.'
                  : 'Історія команд порожня.'
              }
            />
          ) : null}

          {!isLoading && !isError && filteredCommands.length > 0 ? (
            <Table.ScrollContainer minWidth={960}>
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
                  {filteredCommands.map((command) => {
                    const argumentsData = parseJsonField(command.argumentsJson)

                    return (
                      <Table.Tr key={String(command.id)}>
                        <Table.Td>{formatDateTime(command.createdAt)}</Table.Td>
                        <Table.Td maw={280}>{command.rawText}</Table.Td>
                        <Table.Td>
                          <StatusBadge status={command.status} />
                        </Table.Td>
                        <Table.Td>
                          {formatNullable(command.commandCode)}
                        </Table.Td>
                        <Table.Td maw={320}>
                          {argumentsData != null ? (
                            <JsonView data={argumentsData} maxHeight={160} />
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
