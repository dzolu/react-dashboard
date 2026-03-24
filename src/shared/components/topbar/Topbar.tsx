import { Box, Toolbar, Typography } from '@mui/material'

export const Topbar = () => {
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
        <Typography variant="h6">SaaS Admin Dashboard</Typography>
      </Toolbar>
    </Box>
  )
}
