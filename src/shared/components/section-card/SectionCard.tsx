import { Card, CardContent, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

type SectionCardProps = {
  title: string
  children: ReactNode
}

export const SectionCard = ({ title, children }: SectionCardProps) => {
  return (
    <Card elevation={0} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
          {children}
        </Stack>
      </CardContent>
    </Card>
  )
}
