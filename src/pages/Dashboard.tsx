import { useAuth } from '@/lib/auth';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ClipboardList, TrendingUp, BrainCircuit, Calendar, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { userRole, user } = useAuth();

  const { data: employeesCount, isLoading: loadingEmployees } = useQuery({
    queryKey: ['employees-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
    enabled: userRole === 'admin' || userRole === 'hr',
  });

  const { data: todayAttendance, isLoading: loadingAttendance } = useQuery({
    queryKey: ['today-attendance'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { count } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .eq('status', 'present');
      return count || 0;
    },
    enabled: userRole === 'admin' || userRole === 'hr',
  });

  const { data: pendingReviews, isLoading: loadingReviews } = useQuery({
    queryKey: ['pending-reviews'],
    queryFn: async () => {
      const { count } = await supabase
        .from('performance_reviews')
        .select('*', { count: 'exact', head: true })
        .eq('rating', 0);
      return count || 0;
    },
  });

  const { data: myEmployee } = useQuery({
    queryKey: ['my-employee', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      return data;
    },
    enabled: userRole === 'employee' && !!user,
  });

  const roleTitle = userRole === 'admin' ? 'Admin' : userRole === 'hr' ? 'HR Manager' : 'Employee';
  
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {roleTitle}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening in your organization today
          </p>
        </div>

        {(userRole === 'admin' || userRole === 'hr') && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                {loadingEmployees ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{employeesCount}</div>
                )}
                <p className="text-xs text-muted-foreground">Active workforce</p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                <ClipboardList className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                {loadingAttendance ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{todayAttendance}</div>
                )}
                <p className="text-xs text-muted-foreground">Attendance count</p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <FileText className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                {loadingReviews ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{pendingReviews}</div>
                )}
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-accent">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">AI Features</CardTitle>
                <BrainCircuit className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">Active</div>
                <p className="text-xs text-white/80">Resume & Chat AI</p>
              </CardContent>
            </Card>
          </div>
        )}

        {userRole === 'employee' && myEmployee && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><span className="font-medium">Employee ID:</span> {myEmployee.employee_id}</p>
                <p><span className="font-medium">Department:</span> {myEmployee.department}</p>
                <p><span className="font-medium">Position:</span> {myEmployee.position}</p>
                <p><span className="font-medium">Status:</span> <span className="text-success">{myEmployee.status}</span></p>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Performance Reviews</span>
                    <span className="font-bold">{pendingReviews}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md bg-gradient-accent">
              <CardHeader>
                <CardTitle className="text-white">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-sm">Get instant help with HR queries</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(userRole === 'admin' || userRole === 'hr') && (
                <>
                  <a href="/employees" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Manage Employees</p>
                        <p className="text-sm text-muted-foreground">Add, edit, or view employee records</p>
                      </div>
                    </div>
                  </a>
                  <a href="/resume-screening" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3">
                      <BrainCircuit className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium">Screen Resumes with AI</p>
                        <p className="text-sm text-muted-foreground">Upload and analyze candidate resumes</p>
                      </div>
                    </div>
                  </a>
                </>
              )}
              <a href="/chat-assistant" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center space-x-3">
                  <BrainCircuit className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium">AI Chat Assistant</p>
                    <p className="text-sm text-muted-foreground">Get help with HR questions</p>
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>System is up and running</p>
                <p>All features are operational</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
