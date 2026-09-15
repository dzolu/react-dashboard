import { Button, Grid, Stack, Typography } from '@mui/material'

import { useDashboardStatsQuery } from '@/features/dashboard/hooks/useDashboardStatsQuery.ts'
import { useEventsQuery } from '@/features/events/hooks/useEventsQuery.ts'
import { EmptyState } from '@/shared/components/empty-state/EmptyState'
import { ErrorState } from '@/shared/components/error-state/ErrorState.tsx'
import { LoadingState } from '@/shared/components/loading-state/LoadingState.tsx'
import { PageHeader } from '@/shared/components/page-header/PageHeader'
import { SectionCard } from '@/shared/components/section-card/SectionCard'
import { StatCard } from '@/shared/components/stat-card/StatCard'

export function DashboardPage() {
  const {
    data: stats,
    isPending: isStatsPending,
    isError: isStatsError,
  } = useDashboardStatsQuery()

  const {
    data: events,
    isPending: isEventsPending,
    isError: isEventsError,
  } = useEventsQuery()

  const formatHelperText = (value: number) =>
    `${value > 0 ? '+' : ''}${value.toLocaleString()}%`

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Dashboard"
        subtitle="Monitor key metrics, team activity, and platform health."
        actions={<Button variant="contained">Generate report</Button>}
      />
      {isStatsPending ? (
        <LoadingState message="Loading dashboard metrics..." />
      ) : isStatsError || !stats ? (
        <ErrorState
          title="Failed to load dashboard metrics"
          description="Please try again in a moment."
        />
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              label="Total Users"
              value={stats.totalUsers.toLocaleString()}
              helperText={`${formatHelperText(stats.totalUsersChange)} vs last month`}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              label="Active Subscriptions"
              value={stats.activeSubscriptions.toLocaleString()}
              helperText={`${formatHelperText(stats.activeSubscriptionsChange)} conversion rate`}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              label="Monthly Revenue"
              value={`$${stats.monthlyRevenue.toLocaleString()}`}
              helperText={`${formatHelperText(stats.monthlyRevenueChange)} vs last month`}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard
              label="Churn Rate"
              value={`${stats.churnRate}%`}
              helperText={`${formatHelperText(stats.churnRateChange)} vs last month`}
            />
          </Grid>
        </Grid>
      )}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Revenue">
            <EmptyState
              title="No revenue data yet"
              description="Revenue charts and billing trends will appear here once data is available."
            />
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Recent Activity">
            {isEventsPending ? (
              <LoadingState message="Loading recent activity..." />
            ) : isEventsError ? (
              <ErrorState
                title="Failed to load recent activity"
                description="Please refresh the page or try again later."
              />
            ) : !events || events.length === 0 ? (
              <EmptyState
                title="No recent activity"
                description="New events, user actions, and system updates will appear here."
              />
            ) : (
              <Stack spacing={1.5}>
                {events.slice(0, 5).map((event) => (
                  <Stack key={event.id} spacing={0.5}>
                    <Typography fontWeight={600}>{event.message}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.actor} • {event.type}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  )
}
