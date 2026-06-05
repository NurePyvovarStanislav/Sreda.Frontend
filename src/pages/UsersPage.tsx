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
import { createUser, deleteUser, getUsers, updateUser } from '../api/usersApi'
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { PageHeader } from '../components/common/PageHeader'
import {
  UserFormModal,
  type UserFormValues,
} from '../components/users/UserFormModal'
import type { UserResponse } from '../types/user'
import {
  API_CONNECTION_ERROR_MESSAGE,
  formatAccessLevel,
  formatDateTime,
  isConnectionError,
} from '../utils/display'

export function UsersPage() {
  const queryClient = useQueryClient()
  const [formOpened, setFormOpened] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
  const [userToDelete, setUserToDelete] = useState<UserResponse | null>(null)

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  const invalidateUsers = () => {
    void queryClient.invalidateQueries({ queryKey: ['users'] })
  }

  const createMutation = useMutation({
    mutationFn: (values: UserFormValues) =>
      createUser({
        name: values.name.trim(),
        accessLevel: Number(values.accessLevel),
        isActive: values.isActive,
      }),
    onSuccess: () => {
      invalidateUsers()
      setFormOpened(false)
      notifications.show({
        title: 'Успіх',
        message: 'Користувача створено.',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося створити користувача.',
        color: 'red',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: UserResponse['id']
      values: UserFormValues
    }) =>
      updateUser(id, {
        name: values.name.trim(),
        accessLevel: Number(values.accessLevel),
        isActive: values.isActive,
      }),
    onSuccess: () => {
      invalidateUsers()
      setFormOpened(false)
      setSelectedUser(null)
      notifications.show({
        title: 'Успіх',
        message: 'Користувача оновлено.',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося оновити користувача.',
        color: 'red',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: UserResponse['id']) => deleteUser(id),
    onSuccess: () => {
      invalidateUsers()
      setUserToDelete(null)
      notifications.show({
        title: 'Успіх',
        message: 'Користувача видалено.',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося видалити користувача.',
        color: 'red',
      })
    },
  })

  const openCreateForm = () => {
    setFormMode('create')
    setSelectedUser(null)
    setFormOpened(true)
  }

  const openEditForm = (user: UserResponse) => {
    setFormMode('edit')
    setSelectedUser(user)
    setFormOpened(true)
  }

  const handleFormSubmit = (values: UserFormValues) => {
    if (formMode === 'create') {
      createMutation.mutate(values)
      return
    }

    if (selectedUser) {
      updateMutation.mutate({ id: selectedUser.id, values })
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <Stack gap="lg">
      <PageHeader
        title="Користувачі"
        description="Керування користувачами системи Sreda: створення, редагування та видалення."
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
              Додати користувача
            </Button>
          </Group>
        }
      />

      <Card withBorder padding="lg" radius="md">
        {isLoading ? <LoadingState message="Завантаження користувачів…" /> : null}

        {isError ? (
          <ErrorState
            message={
              isConnectionError(error)
                ? API_CONNECTION_ERROR_MESSAGE
                : 'Не вдалося завантажити користувачів.'
            }
            onRetry={() => void refetch()}
          />
        ) : null}

        {!isLoading && !isError && (!data || data.length === 0) ? (
          <EmptyState message="Користувачів поки немає." />
        ) : null}

        {!isLoading && !isError && data && data.length > 0 ? (
          <Table.ScrollContainer minWidth={720}>
            <Table striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Ім’я</Table.Th>
                  <Table.Th>Активний</Table.Th>
                  <Table.Th>Рівень доступу</Table.Th>
                  <Table.Th>Створено</Table.Th>
                  <Table.Th w={100}>Дії</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.map((user) => (
                  <Table.Tr key={String(user.id)}>
                    <Table.Td>{user.name}</Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={user.isActive ? 'green' : 'gray'}
                      >
                        {user.isActive ? 'Так' : 'Ні'}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{formatAccessLevel(user.accessLevel)}</Table.Td>
                    <Table.Td>{formatDateTime(user.createdAt)}</Table.Td>
                    <Table.Td>
                      <Group gap={4} wrap="nowrap">
                        <Tooltip label="Редагувати">
                          <ActionIcon
                            variant="light"
                            onClick={() => openEditForm(user)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Видалити">
                          <ActionIcon
                            variant="light"
                            color="red"
                            onClick={() => setUserToDelete(user)}
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

      <UserFormModal
        opened={formOpened}
        mode={formMode}
        user={selectedUser}
        isSubmitting={isSubmitting}
        onClose={() => {
          setFormOpened(false)
          setSelectedUser(null)
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDeleteModal
        opened={userToDelete != null}
        title="Видалити користувача"
        message={`Ви впевнені, що хочете видалити користувача «${userToDelete?.name ?? ''}»?`}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) {
            deleteMutation.mutate(userToDelete.id)
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </Stack>
  )
}
