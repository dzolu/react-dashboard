import { Box, Button, Chip, Stack, Toolbar, Typography } from '@mui/material'

import { useAuth } from '@/features/auth/context/AuthContext'

export const Topbar = () => {
  const { user, logout } = useAuth()

  return (
    <Box
      component="header"
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar disableGutters sx={{ px: 3 }}>
        <Typography variant="h6" flex={1}>
          Secure CMS
        </Typography>
        {user && (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="body2">{user.displayName}</Typography>
            <Chip
              label={user.role}
              size="small"
              color={user.role === 'Admin' ? 'primary' : 'default'}
            />
            <Button size="small" onClick={logout}>
              Sign out
            </Button>
          </Stack>
        )}
      </Toolbar>
    </Box>
  )
}
