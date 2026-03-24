import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

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
    <Drawer variant="permanent">
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
