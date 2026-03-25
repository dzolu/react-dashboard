import { Button } from '@mui/material'

import { PageHeader } from '@/shared/components/page-header/PageHeader'

export function UsersPage() {
  return (
    <PageHeader
      title="Users"
      subtitle="Manage customer accounts, access, and lifecycle states."
      actions={<Button variant="contained">Invite user</Button>}
    />
  )
}
