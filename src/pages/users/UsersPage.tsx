import { Button, Stack, Typography } from '@mui/material'

import { PageHeader } from '@/shared/components/page-header/PageHeader'
import { SectionCard } from '@/shared/components/section-card/SectionCard'

export function UsersPage() {
  return (
    <Stack spacing={3}>
      <PageHeader
        title="Users"
        subtitle="Manage customer accounts, access, and lifecycle states."
        actions={<Button variant="contained">Invite user</Button>}
      />

      <SectionCard title="Top Users">
        <Stack spacing={1}>
          <Typography>Adam Smith</Typography>
          <Typography>Tomasz Koszkul</Typography>
          <Typography>Dale Carnegie</Typography>
        </Stack>
      </SectionCard>
    </Stack>
  )
}
