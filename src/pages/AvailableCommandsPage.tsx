import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Table,
  Tooltip,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconEdit, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import {
  createAvailableCommand,
  deleteAvailableCommand,
  getAvailableCommands,
  updateAvailableCommand,
} from '../api/availableCommandsApi'
import {
  AvailableCommandFormModal,
  type AvailableCommandFormValues,
} from '../components/availableCommands/AvailableCommandFormModal'
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { PageHeader } from '../components/common/PageHeader'
import type { AvailableCommandResponse } from '../types/availableCommand'
import {
  API_CONNECTION_ERROR_MESSAGE,
  formatAccessLevel,
  formatCommandCategory,
  formatNullable,
  isConnectionError,
} from '../utils/display'

export function AvailableCommandsPage() {
  const queryClient = useQueryClient()
  const [formOpened, setFormOpened] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedCommand, setSelectedCommand] =
    useState<AvailableCommandResponse | null>(null)
  const [commandToDelete, setCommandToDelete] =
    useState<AvailableCommandResponse | null>(null)

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['available-commands'],
    queryFn: getAvailableCommands,
  })

  const invalidateCommands = () => {
    void queryClient.invalidateQueries({ queryKey: ['available-commands'] })
  }

  const buildRequestPayload = (values: AvailableCommandFormValues) => ({
    name: values.name.trim(),
    description: values.description.trim() || null,
    category: Number(values.category),
    requiresDevice: values.requiresDevice,
    requiredAccessLevel: Number(values.requiredAccessLevel),
    isEnabled: values.isEnabled,
  })

  const createMutation = useMutation({
    mutationFn: (values: AvailableCommandFormValues) =>
      createAvailableCommand({
        code: values.code.trim(),
        ...buildRequestPayload(values),
      }),
    onSuccess: () => {
      invalidateCommands()
      setFormOpened(false)
      notifications.show({
        title: 'Успіх',
        message: 'Команду створено.',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося створити команду.',
        color: 'red',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: AvailableCommandResponse['id']
      values: AvailableCommandFormValues
    }) => updateAvailableCommand(id, buildRequestPayload(values)),
    onSuccess: () => {
      invalidateCommands()
      setFormOpened(false)
      setSelectedCommand(null)
      notifications.show({
        title: 'Успіх',
        message: 'Команду оновлено.',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося оновити команду.',
        color: 'red',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: AvailableCommandResponse['id']) =>
      deleteAvailableCommand(id),
    onSuccess: () => {
      invalidateCommands()
      setCommandToDelete(null)
      notifications.show({
        title: 'Успіх',
        message: 'Команду видалено.',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося видалити команду.',
        color: 'red',
      })
    },
  })

  const openCreateForm = () => {
    setFormMode('create')
    setSelectedCommand(null)
    setFormOpened(true)
  }

  const openEditForm = (command: AvailableCommandResponse) => {
    setFormMode('edit')
    setSelectedCommand(command)
    setFormOpened(true)
  }

  const handleFormSubmit = (values: AvailableCommandFormValues) => {
    if (formMode === 'create') {
      createMutation.mutate(values)
      return
    }

    if (selectedCommand) {
      updateMutation.mutate({ id: selectedCommand.id, values })
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Stack gap="lg">
      <PageHeader
        title="Каталог команд"
        description="Керування доступними intent-ами та діями системи Sreda."
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
              Додати команду
            </Button>
          </Group>
        }
      />

      <Card withBorder padding="lg" radius="md">
        {isLoading ? <LoadingState message="Завантаження команд…" /> : null}

        {isError ? (
          <ErrorState
            message={
              isConnectionError(error)
                ? API_CONNECTION_ERROR_MESSAGE
                : 'Не вдалося завантажити каталог команд.'
            }
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isLoading && !isError && (!data || data.length === 0) ? (
          <EmptyState message="Команд у каталозі поки немає." />
        ) : null}

        {!isLoading && !isError && data && data.length > 0 ? (
          <Table.ScrollContainer minWidth={1000}>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Код</Table.Th>
                  <Table.Th>Назва</Table.Th>
                  <Table.Th>Опис</Table.Th>
                  <Table.Th>Категорія</Table.Th>
                  <Table.Th>Рівень доступу</Table.Th>
                  <Table.Th>Пристрій</Table.Th>
                  <Table.Th>Увімкнена</Table.Th>
                  <Table.Th w={100}>Дії</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.map((command) => (
                  <Table.Tr key={String(command.id)}>
                    <Table.Td>{command.code}</Table.Td>
                    <Table.Td>{command.name}</Table.Td>
                    <Table.Td maw={240}>
                      {formatNullable(command.description)}
                    </Table.Td>
                    <Table.Td>{formatCommandCategory(command.category)}</Table.Td>
                    <Table.Td>
                      {formatAccessLevel(command.requiredAccessLevel)}
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={command.requiresDevice ? 'blue' : 'gray'}
                      >
                        {command.requiresDevice ? 'Так' : 'Ні'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={command.isEnabled ? 'green' : 'gray'}
                      >
                        {command.isEnabled ? 'Так' : 'Ні'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4} wrap="nowrap">
                        <Tooltip label="Редагувати">
                          <ActionIcon
                            variant="light"
                            onClick={() => openEditForm(command)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Видалити">
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => setCommandToDelete(command)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        ) : null}
      </Card>

      <AvailableCommandFormModal
        key={formOpened ? `${formMode}-${selectedCommand?.id ?? 'new'}` : 'closed'}
        opened={formOpened}
        mode={formMode}
        command={selectedCommand}
        isSubmitting={isSubmitting}
        onClose={() => {
          setFormOpened(false)
          setSelectedCommand(null)
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDeleteModal
        opened={commandToDelete != null}
        title="Видалити команду"
        message={`Ви впевнені, що хочете видалити команду «${commandToDelete?.code ?? ''}»?`}
        onClose={() => setCommandToDelete(null)}
        onConfirm={() => {
          if (commandToDelete) {
            deleteMutation.mutate(commandToDelete.id)
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </Stack>
  )
}
