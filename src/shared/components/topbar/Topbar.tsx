import { AppBar, Toolbar, Typography } from '@mui/material'

export const Topbar = () => {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6">SaaS Admin Dashboard</Typography>
      </Toolbar>
    </AppBar>
  )
}
