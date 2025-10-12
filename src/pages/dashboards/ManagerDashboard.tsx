import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const ManagerDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['manager-stats'],
    queryFn: async () => {
      const [employees, leaveRequests, announcements] = await Promise.all([
        supabase.from('employees').select('*', { count: 'exact' }),
        supabase.from('leave_requests').select('*').eq('status', 'pending'),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      return {
        totalEmployees: employees.count || 0,
        pendingLeaves: leaveRequests.data || [],
        recentAnnouncements: announcements.data || [],
      };
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Manager Dashboard</h2>
        <p className="text-muted-foreground">Team management and leave approvals</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Users className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEmployees || 0}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leave Requests</CardTitle>
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center shadow-glow">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingLeaves?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Pending Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.pendingLeaves && stats.pendingLeaves.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.pendingLeaves.map((leave: any) => (
                  <TableRow key={leave.id}>
                    <TableCell className="capitalize">{leave.leave_type}</TableCell>
                    <TableCell>{new Date(leave.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(leave.end_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{leave.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" asChild>
                        <a href="/leave-management">Review</a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-4">No pending leave requests</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <a href="/employees" className="p-4 border rounded-lg hover:bg-accent transition-colors">
            <Users className="w-6 h-6 mb-2 text-primary" />
            <h3 className="font-semibold">View Team</h3>
            <p className="text-sm text-muted-foreground">See all team members</p>
          </a>
          <a href="/leave-management" className="p-4 border rounded-lg hover:bg-accent transition-colors">
            <Calendar className="w-6 h-6 mb-2 text-primary" />
            <h3 className="font-semibold">Leave Management</h3>
            <p className="text-sm text-muted-foreground">Approve or reject leave requests</p>
          </a>
        </CardContent>
      </Card>
    </div>
  );
};
