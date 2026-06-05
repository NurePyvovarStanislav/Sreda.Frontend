import { NavLink as MantineNavLink, Stack, Text } from '@mantine/core'
import {
  IconCommand,
  IconDashboard,
  IconDevices,
  IconHistory,
  IconList,
  IconMessage,
  IconUsers,
} from '@tabler/icons-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Головна панель', icon: IconDashboard, end: true },
  { to: '/devices', label: 'Пристрої', icon: IconDevices },
  { to: '/events', label: 'Події', icon: IconList },
  { to: '/commands', label: 'Історія команд', icon: IconHistory },
  { to: '/users', label: 'Користувачі', icon: IconUsers },
  {
    to: '/available-commands',
    label: 'Каталог команд',
    icon: IconCommand,
  },
  {
    to: '/command-phrases',
    label: 'Фрази команд',
    icon: IconMessage,
  },
] as const

export function Navbar() {
  return (
    <Stack gap="xs" p="md">
      <Text size="xs" tt="uppercase" fw={600} c="dimmed" mb="xs">
        Навігація
      </Text>
      {navItems.map(({ to, label, icon: Icon, ...rest }) => (
        <MantineNavLink
          key={to}
          component={NavLink}
          to={to}
          label={label}
          leftSection={<Icon size={18} stroke={1.5} />}
          variant="light"
          {...rest}
        />
      ))}
    </Stack>
  )
}
