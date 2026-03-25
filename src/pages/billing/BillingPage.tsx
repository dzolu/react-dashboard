import { Button } from '@mui/material'

import { PageHeader } from '@/shared/components/page-header/PageHeader'

export function BillingPage() {
  return (
    <PageHeader
      title="Billing"
      subtitle="Review subscriptions, invoices, and revenue activity."
      actions={<Button variant="contained">Download invoice</Button>}
    />
  )
}
