import { Stack, Typography } from '@mui/material'

type ErrorStateProps = {
  title: string
  description?: string
}

export const ErrorState = ({ title, description }: ErrorStateProps) => {
  return (
    <Stack
      spacing={1}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <Typography variant="h6" fontWeight={600} color="error.main">
        {title}
      </Typography>

      {description ? (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      ) : null}
    </Stack>
  )
}
