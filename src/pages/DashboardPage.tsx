import { Card, SimpleGrid, Stack, Text } from '@mantine/core'
import { PageHeader } from '../components/common/PageHeader'

const overviewCards = [
  {
    title: 'Команди',
    description: 'Текстові та голосові команди для керування середовищем.',
  },
  {
    title: 'Пристрої',
    description: 'Стан підключених пристроїв та результат виконання дій.',
  },
  {
    title: 'Події',
    description: 'Журнал системних подій і відповідей API.',
  },
]

export function DashboardPage() {
  return (
    <Stack gap="lg">
      <PageHeader
        title="Головна панель"
        description="Огляд системи Sreda: команди, пристрої та події в одному місці."
      />

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {overviewCards.map((card) => (
          <Card key={card.title} withBorder padding="lg" radius="md">
            <Stack gap="xs">
              <Text fw={600}>{card.title}</Text>
              <Text size="sm" c="dimmed">
                {card.description}
              </Text>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Card withBorder padding="lg" radius="md">
        <Text size="sm" c="dimmed">
          Ця сторінка буде показувати зведену статистику після підключення API.
        </Text>
      </Card>
    </Stack>
  )
}
