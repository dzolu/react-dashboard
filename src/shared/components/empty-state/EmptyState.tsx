import { Stack, Typography } from '@mui/material'

type EmptyStateProps = {
  title: string
  description?: string
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <Stack
      spacing={1}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
    >
      <Typography variant="h6" fontWeight={600}>
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
