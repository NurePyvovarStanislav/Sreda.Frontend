import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  IconEdit,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconTrash,
} from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import {
  createDevice,
  deleteDevice,
  getDeviceState,
  getDevices,
  updateDevice,
  updateDeviceState,
} from '../api/devicesApi'
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal'
import {
  buildDeviceLocalizations,
  DeviceFormModal,
  toDeviceType,
  type DeviceFormValues,
} from '../components/devices/DeviceFormModal'
import {
  DeviceStateModal,
  type DeviceStateFormValues,
} from '../components/devices/DeviceStateModal'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { JsonView } from '../components/common/JsonView'
import { LoadingState } from '../components/common/LoadingState'
import { PageHeader } from '../components/common/PageHeader'
import type { DeviceResponse, DeviceStateResponse } from '../types/device'
import {
  API_CONNECTION_ERROR_MESSAGE,
  formatDeviceType,
  formatNullable,
  isConnectionError,
  matchesSearch,
  parseJsonField,
} from '../utils/display'

export function DevicesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [formOpened, setFormOpened] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedDevice, setSelectedDevice] = useState<DeviceResponse | null>(
    null,
  )
  const [deviceToDelete, setDeviceToDelete] = useState<DeviceResponse | null>(
    null,
  )
  const [stateDevice, setStateDevice] = useState<DeviceResponse | null>(null)
  const [loadedState, setLoadedState] = useState<DeviceStateResponse | null>(
    null,
  )
  const [isStateLoading, setIsStateLoading] = useState(false)

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
  })

  const filteredDevices = useMemo(() => {
    if (!data) {
      return []
    }

    return data.filter((device) => {
      const haystack = [
        device.code,
        device.name,
        device.location ?? '',
      ].join(' ')

      return matchesSearch(haystack, search)
    })
  }, [data, search])

  const invalidateDevices = () => {
    void queryClient.invalidateQueries({ queryKey: ['devices'] })
  }

  const createMutation = useMutation({
    mutationFn: (values: DeviceFormValues) =>
      createDevice({
        code: values.code.trim(),
        localizations: buildDeviceLocalizations(values.name, values.location),
        type: toDeviceType(values.type),
        isActive: values.isActive,
      }),
    onSuccess: () => {
      invalidateDevices()
      setFormOpened(false)
      notifications.show({
        title: 'Успіх',
        message: 'Пристрій створено.',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося створити пристрій.',
        color: 'red',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: DeviceResponse['id']
      values: DeviceFormValues
    }) =>
      updateDevice(id, {
        localizations: buildDeviceLocalizations(values.name, values.location),
        type: toDeviceType(values.type),
        isActive: values.isActive,
      }),
    onSuccess: () => {
      invalidateDevices()
      setFormOpened(false)
      setSelectedDevice(null)
      notifications.show({
        title: 'Успіх',
        message: 'Пристрій оновлено.',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося оновити пристрій.',
        color: 'red',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: DeviceResponse['id']) => deleteDevice(id),
    onSuccess: () => {
      invalidateDevices()
      setDeviceToDelete(null)
      notifications.show({
        title: 'Успіх',
        message: 'Пристрій видалено.',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося видалити пристрій.',
        color: 'red',
      })
    },
  })

  const updateStateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: DeviceResponse['id']
      values: DeviceStateFormValues
    }) =>
      updateDeviceState(id, {
        isOnline: values.isOnline,
        stateJson: values.stateJson.trim() || null,
      }),
    onSuccess: () => {
      invalidateDevices()
      setStateDevice(null)
      setLoadedState(null)
      notifications.show({
        title: 'Успіх',
        message: 'Стан пристрою оновлено.',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося оновити стан пристрою.',
        color: 'red',
      })
    },
  })

  const openCreateForm = () => {
    setFormMode('create')
    setSelectedDevice(null)
    setFormOpened(true)
  }

  const openEditForm = (device: DeviceResponse) => {
    setFormMode('edit')
    setSelectedDevice(device)
    setFormOpened(true)
  }

  const openStateModal = async (device: DeviceResponse) => {
    setStateDevice(device)
    setLoadedState(null)
    setIsStateLoading(true)

    try {
      const state = await getDeviceState(device.id)
      setLoadedState(state)
    } catch {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося завантажити стан пристрою.',
        color: 'red',
      })
      setStateDevice(null)
    } finally {
      setIsStateLoading(false)
    }
  }

  const handleFormSubmit = (values: DeviceFormValues) => {
    if (formMode === 'create') {
      createMutation.mutate(values)
      return
    }

    if (selectedDevice) {
      updateMutation.mutate({ id: selectedDevice.id, values })
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Stack gap="lg">
      <PageHeader
        title="Пристрої"
        description="Керування пристроями системи Sreda: створення, редагування, стан та видалення."
        actions={
          <Group gap="sm">
            <Button
              variant="light"
              leftSection={<IconRefresh size={16} />}
              onClick={() => void refetch()}
              loading={isFetching && !isLoading}
            >
              Оновити
            </Button>
            <Button leftSection={<IconPlus size={16} />} onClick={openCreateForm}>
              Додати пристрій
            </Button>
          </Group>
        }
      />

      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <TextInput
            placeholder="Пошук за кодом, назвою або локацією…"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />

          {isLoading ? <LoadingState message="Завантаження пристроїв…" /> : null}

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

          {!isLoading && !isError && filteredDevices.length === 0 ? (
            <EmptyState
              message={
                data && data.length > 0
                  ? 'За вашим запитом пристроїв не знайдено.'
                  : 'Пристрої відсутні.'
              }
            />
          ) : null}

          {!isLoading && !isError && filteredDevices.length > 0 ? (
            <Table.ScrollContainer minWidth={1100}>
              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Код</Table.Th>
                    <Table.Th>Назва</Table.Th>
                    <Table.Th>Тип</Table.Th>
                    <Table.Th>Локація</Table.Th>
                    <Table.Th>Статус</Table.Th>
                    <Table.Th>Online</Table.Th>
                    <Table.Th>StateJson</Table.Th>
                    <Table.Th w={130}>Дії</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredDevices.map((device) => {
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
                            {device.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {device.isOnline == null ? (
                            <Text size="sm" c="dimmed">
                              —
                            </Text>
                          ) : (
                            <Badge
                              variant="light"
                              color={device.isOnline ? 'green' : 'gray'}
                            >
                              {device.isOnline ? 'Online' : 'Offline'}
                            </Badge>
                          )}
                        </Table.Td>
                        <Table.Td maw={280}>
                          {state != null ? (
                            <JsonView data={state} maxHeight={140} />
                          ) : (
                            <Text size="sm" c="dimmed">
                              —
                            </Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Group gap={4} wrap="nowrap">
                            <Tooltip label="Редагувати">
                              <ActionIcon
                                variant="light"
                                onClick={() => openEditForm(device)}
                              >
                                <IconEdit size={16} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Оновити стан">
                              <ActionIcon
                                variant="light"
                                color="blue"
                                onClick={() => void openStateModal(device)}
                              >
                                <IconSettings size={16} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Видалити">
                              <ActionIcon
                                variant="light"
                                color="red"
                                onClick={() => setDeviceToDelete(device)}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
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

      <DeviceFormModal
        opened={formOpened}
        mode={formMode}
        device={selectedDevice}
        isSubmitting={isSubmitting}
        onClose={() => {
          setFormOpened(false)
          setSelectedDevice(null)
        }}
        onSubmit={handleFormSubmit}
      />

      <DeviceStateModal
        opened={stateDevice != null}
        deviceName={stateDevice?.name}
        initialState={loadedState}
        isSubmitting={updateStateMutation.isPending}
        isLoading={isStateLoading}
        onClose={() => {
          setStateDevice(null)
          setLoadedState(null)
        }}
        onSubmit={(values) => {
          if (stateDevice) {
            updateStateMutation.mutate({ id: stateDevice.id, values })
          }
        }}
      />

      <ConfirmDeleteModal
        opened={deviceToDelete != null}
        title="Видалити пристрій"
        message={`Ви впевнені, що хочете видалити пристрій «${deviceToDelete?.name ?? deviceToDelete?.code ?? ''}»?`}
        onClose={() => setDeviceToDelete(null)}
        onConfirm={() => {
          if (deviceToDelete) {
            deleteMutation.mutate(deviceToDelete.id)
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </Stack>
  )
}
