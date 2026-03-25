import { Button } from '@mui/material'

import { PageHeader } from '@/shared/components/page-header/PageHeader'

export function EventsPage() {
  return (
    <PageHeader
      title="Events"
      subtitle="Track product activity, system events, and audit history."
      actions={<Button variant="contained">Export events</Button>}
    />
  )
}
