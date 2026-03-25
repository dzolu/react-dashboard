import { Button } from '@mui/material'

import { PageHeader } from '@/shared/components/page-header/PageHeader'

export function SettingsPage() {
  return (
    <PageHeader
      title="Settings"
      subtitle="Configure workspace preferences, security, and account defaults."
      actions={<Button variant="contained">Save changes</Button>}
    />
  )
}
