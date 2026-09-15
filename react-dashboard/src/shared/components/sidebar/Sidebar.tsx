import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

const sidebarWidth = 240

const menuItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Users', path: '/users' },
  { label: 'Billing', path: '/billing' },
  { label: 'Events', path: '/events' },
  { label: 'Settings', path: '/settings' },
]

export const Sidebar = () => {
  const navigate = useNavigate()

  return (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        width: sidebarWidth,
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: sidebarWidth,
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItemButton key={item.path} onClick={() => navigate(item.path)}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  )
}
