import { CircularProgress, Stack, Typography } from '@mui/material'

type LoadingStateProps = {
  message?: string
}

export const LoadingState = ({
  message = 'Loading data...',
}: LoadingStateProps) => {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <CircularProgress size={28} />

      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Stack>
  )
}
