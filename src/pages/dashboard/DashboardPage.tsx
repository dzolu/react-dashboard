import { Button, Stack, Typography } from '@mui/material'

import { PageHeader } from '@/shared/components/page-header/PageHeader'
import { SectionCard } from '@/shared/components/section-card/SectionCard'

export function DashboardPage() {
  return (
    <Stack spacing={3}>
      <PageHeader
        title="Dashboard"
        subtitle="Monitor key metrics, team activity, and platform health."
        actions={<Button variant="contained">Generate report</Button>}
      />
      <SectionCard title="Revenue">
        <Typography color="text.secondary">Chart coming soon</Typography>
      </SectionCard>

      <SectionCard title="Recent Activity">
        <Typography color="text.secondary">
          Activity list coming soon
        </Typography>
      </SectionCard>
    </Stack>
  )
}
