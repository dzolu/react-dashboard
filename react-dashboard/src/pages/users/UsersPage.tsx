import {
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

import { useUsersQuery } from '@/features/users/hooks/useUsersQuery.ts'
import { EmptyState } from '@/shared/components/empty-state/EmptyState'
import { ErrorState } from '@/shared/components/error-state/ErrorState.tsx'
import { LoadingState } from '@/shared/components/loading-state/LoadingState.tsx'
import { PageHeader } from '@/shared/components/page-header/PageHeader'

export function UsersPage() {
  const {
    data: users,
    isPending: isUsersPending,
    isError: isUsersError,
  } = useUsersQuery()

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Users"
        subtitle="Manage customer accounts, access, and lifecycle states."
        actions={<Button variant="contained">Invite user</Button>}
      />

      {isUsersPending ? (
        <LoadingState message="Loading users..." />
      ) : isUsersError ? (
        <ErrorState
          title="Failed to load users"
          description="Please refresh the page or try again later."
        />
      ) : !users || users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Users will appear here once accounts have been created."
        />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>
                    <Chip label={user.status} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  )
}
