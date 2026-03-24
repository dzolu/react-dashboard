import { Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

export function UserDetailsPage() {
  const { userId } = useParams()

  return (
    <Typography variant="h4">
      User Details {userId ? `- ${userId}` : ''}
    </Typography>
  )
}
