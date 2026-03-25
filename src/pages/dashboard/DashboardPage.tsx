import { Button } from '@mui/material'

import { PageHeader } from '@/shared/components/page-header/PageHeader'

export function DashboardPage() {
  return (
    <PageHeader
      title="Dashboard"
      subtitle="Monitor key metrics, team activity, and platform health."
      actions={<Button variant="contained">Generate report</Button>}
    />
  )
}
