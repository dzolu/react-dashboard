import { Button, Grid, Stack, Typography } from '@mui/material'

import { PageHeader } from '@/shared/components/page-header/PageHeader'
import { SectionCard } from '@/shared/components/section-card/SectionCard'
import { StatCard } from '@/shared/components/stat-card/StatCard.tsx'

export function DashboardPage() {
  return (
    <Stack spacing={3}>
      <PageHeader
        title="Dashboard"
        subtitle="Monitor key metrics, team activity, and platform health."
        actions={<Button variant="contained">Generate report</Button>}
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Total Users"
            value="1,284"
            helperText="+8.2% vs last month"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Active Subscriptions"
            value="892"
            helperText="69.5% conversion rate"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Monthly Revenue"
            value="$48,230"
            helperText="+12.4% vs last month"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Churn Rate"
            value="2.4%"
            helperText="-0.3% vs last month"
          />
        </Grid>
      </Grid>
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
