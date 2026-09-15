import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { type FormEvent, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '@/features/auth/context/AuthContext'

export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('editor@securecms.local')
  const [password, setPassword] = useState('Editor123!')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (user) return <Navigate to="/events" replace />

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await login(email, password)
      const destination = (location.state as { from?: string } | null)?.from
      navigate(destination ?? '/events', { replace: true })
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Login failed.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box minHeight="100vh" display="grid" sx={{ placeItems: 'center' }} p={3}>
      <Paper
        component="form"
        onSubmit={submit}
        sx={{ width: '100%', maxWidth: 440, p: 4 }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Secure CMS
            </Typography>
            <Typography color="text.secondary">
              Sign in to manage audit events.
            </Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
          <Typography variant="body2" color="text.secondary">
            Editor: editor@securecms.local / Editor123!
            <br />
            Admin: admin@securecms.local / Admin123!
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}
