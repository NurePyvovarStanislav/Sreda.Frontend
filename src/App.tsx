import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { AvailableCommandsPage } from './pages/AvailableCommandsPage'
import { CommandHistoryPage } from './pages/CommandHistoryPage'
import { CommandPhrasesPage } from './pages/CommandPhrasesPage'
import { DashboardPage } from './pages/DashboardPage'
import { DevicesPage } from './pages/DevicesPage'
import { EventsPage } from './pages/EventsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { UsersPage } from './pages/UsersPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="devices" element={<DevicesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="commands" element={<CommandHistoryPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="available-commands" element={<AvailableCommandsPage />} />
        <Route path="command-phrases" element={<CommandPhrasesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
