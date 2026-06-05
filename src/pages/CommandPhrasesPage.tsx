import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Select,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconEdit, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { getAvailableCommands } from '../api/availableCommandsApi'
import {
  createCommandPhrase,
  deleteCommandPhrase,
  getCommandPhrases,
  updateCommandPhrase,
} from '../api/commandPhrasesApi'
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal'
import {
  CommandPhraseFormModal,
  type CommandPhraseFormValues,
} from '../components/commandPhrases/CommandPhraseFormModal'
import { EmptyState } from '../components/common/EmptyState'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { PageHeader } from '../components/common/PageHeader'
import type { AvailableCommandResponse } from '../types/availableCommand'
import type { CommandPhraseResponse } from '../types/commandPhrase'
import {
  API_CONNECTION_ERROR_MESSAGE,
  buildAvailableCommandSelectOptions,
  findAvailableCommandById,
  isConnectionError,
} from '../utils/display'

const EMPTY_AVAILABLE_COMMANDS: AvailableCommandResponse[] = []

function CommandCell({
  commandId,
  commands,
}: {
  commandId: CommandPhraseResponse['availableCommandId']
  commands: AvailableCommandResponse[] | undefined
}) {
  const command = findAvailableCommandById(commands, commandId)

  if (command) {
    return (
      <Stack gap={2}>
        <Text size="sm" fw={500}>
          {command.code}
        </Text>
        <Text size="xs" c="dimmed">
          {command.name}
        </Text>
      </Stack>
    )
  }

  return (
    <Text size="sm" c="dimmed">
      ID: {commandId}
    </Text>
  )
}

function useAvailableCommandsForPhrases() {
  return useQuery({
    queryKey: ['available-commands'],
    queryFn: getAvailableCommands,
  })
}

export function CommandPhrasesPage() {
  const queryClient = useQueryClient()
  const [commandFilter, setCommandFilter] = useState<string | null>(null)
  const [formOpened, setFormOpened] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedPhrase, setSelectedPhrase] =
    useState<CommandPhraseResponse | null>(null)
  const [phraseToDelete, setPhraseToDelete] =
    useState<CommandPhraseResponse | null>(null)

  const commandsQuery = useAvailableCommandsForPhrases()

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['command-phrases', { availableCommandId: commandFilter }],
    queryFn: () =>
      getCommandPhrases({
        availableCommandId: commandFilter ?? undefined,
      }),
  })

  const filterOptions = useMemo(() => {
    const options = buildAvailableCommandSelectOptions(
      commandsQuery.data ?? EMPTY_AVAILABLE_COMMANDS,
    )
    return [{ value: '', label: 'Усі команди' }, ...options]
  }, [commandsQuery.data])

  const invalidatePhrases = () => {
    void queryClient.invalidateQueries({ queryKey: ['command-phrases'] })
  }

  const createMutation = useMutation({
    mutationFn: (values: CommandPhraseFormValues) =>
      createCommandPhrase({
        availableCommandId: values.availableCommandId,
        phrase: values.phrase.trim(),
        language: values.language,
        isActive: values.isActive,
      }),
    onSuccess: () => {
      invalidatePhrases()
      setFormOpened(false)
      notifications.show({
        title: 'Успіх',
        message: 'Фразу створено.',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося створити фразу.',
        color: 'red',
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: CommandPhraseResponse['id']
      values: CommandPhraseFormValues
    }) =>
      updateCommandPhrase(id, {
        phrase: values.phrase.trim(),
        language: values.language,
        isActive: values.isActive,
      }),
    onSuccess: () => {
      invalidatePhrases()
      setFormOpened(false)
      setSelectedPhrase(null)
      notifications.show({
        title: 'Успіх',
        message: 'Фразу оновлено.',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося оновити фразу.',
        color: 'red',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: CommandPhraseResponse['id']) => deleteCommandPhrase(id),
    onSuccess: () => {
      invalidatePhrases()
      setPhraseToDelete(null)
      notifications.show({
        title: 'Успіх',
        message: 'Фразу видалено.',
        color: 'green',
      })
    },
    onError: () => {
      notifications.show({
        title: 'Помилка',
        message: 'Не вдалося видалити фразу.',
        color: 'red',
      })
    },
  })

  const openCreateForm = () => {
    setFormMode('create')
    setSelectedPhrase(null)
    setFormOpened(true)
  }

  const openEditForm = (phrase: CommandPhraseResponse) => {
    setFormMode('edit')
    setSelectedPhrase(phrase)
    setFormOpened(true)
  }

  const handleFormSubmit = (values: CommandPhraseFormValues) => {
    if (formMode === 'create') {
      createMutation.mutate(values)
      return
    }

    if (selectedPhrase) {
      updateMutation.mutate({ id: selectedPhrase.id, values })
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const isPageLoading = isLoading || commandsQuery.isLoading
  const isPageError = isError || commandsQuery.isError
  const pageError = error ?? commandsQuery.error

  return (
    <Stack gap="lg">
      <PageHeader
        title="Фрази команд"
        description="Зіставлення мовних фраз із доступними командами системи Sreda."
        actions={
          <Group gap="sm">
            <Button
              variant="light"
              leftSection={<IconRefresh size={16} />}
              onClick={() => {
                void refetch()
                void commandsQuery.refetch()
              }}
              loading={(isFetching || commandsQuery.isFetching) && !isPageLoading}
            >
              Оновити
            </Button>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreateForm}
              disabled={(commandsQuery.data?.length ?? 0) === 0}
            >
              Додати фразу
            </Button>
          </Group>
        }
      />

      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Select
            label="Фільтр за командою"
            placeholder="Усі команди"
            clearable
            data={filterOptions.filter((option) => option.value !== '')}
            value={commandFilter}
            onChange={setCommandFilter}
            searchable
            nothingFoundMessage="Команд не знайдено"
          />

          {isPageLoading ? <LoadingState message="Завантаження фраз…" /> : null}

          {isPageError ? (
            <ErrorState
              message={
                isConnectionError(pageError)
                  ? API_CONNECTION_ERROR_MESSAGE
                  : 'Не вдалося завантажити фрази команд.'
              }
              onRetry={() => {
                void refetch()
                void commandsQuery.refetch()
              }}
            />
          ) : null}

          {!isPageLoading &&
          !isPageError &&
          (commandsQuery.data?.length ?? 0) === 0 ? (
            <EmptyState message="Спочатку додайте команди в каталозі." />
          ) : null}

          {!isPageLoading &&
          !isPageError &&
          (commandsQuery.data?.length ?? 0) > 0 &&
          (!data || data.length === 0) ? (
            <EmptyState message="Фраз команд поки немає." />
          ) : null}

          {!isPageLoading &&
          !isPageError &&
          data &&
          data.length > 0 ? (
            <Table.ScrollContainer minWidth={900}>
              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Команда</Table.Th>
                    <Table.Th>Фраза</Table.Th>
                    <Table.Th>Мова</Table.Th>
                    <Table.Th>Активна</Table.Th>
                    <Table.Th w={100}>Дії</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data.map((phrase) => (
                    <Table.Tr key={String(phrase.id)}>
                      <Table.Td maw={220}>
                        <CommandCell
                          commandId={phrase.availableCommandId}
                          commands={commandsQuery.data}
                        />
                      </Table.Td>
                      <Table.Td maw={320}>{phrase.phrase}</Table.Td>
                      <Table.Td>{phrase.language}</Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={phrase.isActive ? 'green' : 'gray'}
                        >
                          {phrase.isActive ? 'Так' : 'Ні'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4} wrap="nowrap">
                          <Tooltip label="Редагувати">
                            <ActionIcon
                              variant="light"
                              onClick={() => openEditForm(phrase)}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Видалити">
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={() => setPhraseToDelete(phrase)}
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
        </Stack>
      </Card>

      <CommandPhraseFormModal
        key={formOpened ? `${formMode}-${selectedPhrase?.id ?? 'new'}` : 'closed'}
        opened={formOpened}
        mode={formMode}
        phrase={selectedPhrase}
        commands={commandsQuery.data ?? EMPTY_AVAILABLE_COMMANDS}
        isSubmitting={isSubmitting}
        onClose={() => {
          setFormOpened(false)
          setSelectedPhrase(null)
        }}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDeleteModal
        opened={phraseToDelete != null}
        title="Видалити фразу"
        message={`Ви впевнені, що хочете видалити фразу «${phraseToDelete?.phrase ?? ''}»?`}
        onClose={() => setPhraseToDelete(null)}
        onConfirm={() => {
          if (phraseToDelete) {
            deleteMutation.mutate(phraseToDelete.id)
          }
        }}
        isLoading={deleteMutation.isPending}
      />
    </Stack>
  )
}
