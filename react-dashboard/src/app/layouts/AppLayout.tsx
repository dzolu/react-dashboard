import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/shared/components/sidebar/Sidebar'
import { Topbar } from '@/shared/components/topbar/Topbar'

export const AppLayout = () => {
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column">
        <Topbar />
        <Box component="main" p={3}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
