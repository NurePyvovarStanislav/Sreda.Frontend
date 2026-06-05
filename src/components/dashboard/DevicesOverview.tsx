import {
  Badge,
  Button,
  Card,
  Group,
  Loader,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { getDevices } from '../../api/devicesApi'
import {
  API_CONNECTION_ERROR_MESSAGE,
  formatDeviceType,
  formatNullable,
  isConnectionError,
  parseJsonField,
} from '../../utils/display'
import { ErrorState } from '../common/ErrorState'
import { JsonView } from '../common/JsonView'

export function DevicesOverview() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
  })

  return (
    <Card withBorder padding="lg" radius="md">
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={4}>Пристрої</Title>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconRefresh size={14} />}
            onClick={() => void refetch()}
            loading={isFetching && !isLoading}
          >
            Оновити
          </Button>
        </Group>

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
                : 'Не вдалося завантажити пристрої.'
            }
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isLoading && !isError ? (
          data && data.length > 0 ? (
            <Table.ScrollContainer minWidth={800}>
              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Код</Table.Th>
                    <Table.Th>Назва</Table.Th>
                    <Table.Th>Тип</Table.Th>
                    <Table.Th>Локація</Table.Th>
                    <Table.Th>Активний</Table.Th>
                    <Table.Th>Online</Table.Th>
                    <Table.Th>Стан</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.map((device) => {
                    const state = parseJsonField(device.stateJson)

                    return (
                      <Table.Tr key={String(device.id)}>
                        <Table.Td>{device.code}</Table.Td>
                        <Table.Td>{device.name}</Table.Td>
                        <Table.Td>{formatDeviceType(device.type)}</Table.Td>
                        <Table.Td>{formatNullable(device.location)}</Table.Td>
                        <Table.Td>
                          <Badge
                            variant="light"
                            color={device.isActive ? 'green' : 'gray'}
                          >
                            {device.isActive ? 'Так' : 'Ні'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {device.isOnline == null ? (
                            '—'
                          ) : (
                            <Badge
                              variant="light"
                              color={device.isOnline ? 'green' : 'gray'}
                            >
                              {device.isOnline ? 'Так' : 'Ні'}
                            </Badge>
                          )}
                        </Table.Td>
                        <Table.Td maw={280}>
                          {state != null ? (
                            <JsonView data={state} maxHeight={120} />
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
              Пристрої відсутні.
            </Text>
          )
        ) : null}
      </Stack>
    </Card>
  )
}
