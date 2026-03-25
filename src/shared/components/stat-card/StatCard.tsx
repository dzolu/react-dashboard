import { Card, CardContent, Stack, Typography } from '@mui/material'

type StatCardProps = {
  label: string
  value: string | number
  helperText?: string
}

export const StatCard = ({ label, value, helperText }: StatCardProps) => {
  return (
    <Card elevation={0} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
          {helperText && (
            <Typography variant="caption">{helperText}</Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
