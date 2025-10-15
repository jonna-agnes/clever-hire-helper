import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, Calendar, FileText, TrendingUp, Brain, BarChart3, UserPlus } from 'lucide-react';
import { RoleBasedChatAssistant } from '@/components/RoleBasedChatAssistant';

export const HRDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['hr-stats'],
    queryFn: async () => {
      const [employees, jobPostings, interviews, leaveRequests, screenings] = await Promise.all([
        supabase.from('employees').select('*', { count: 'exact' }),
        supabase.from('job_postings').select('*', { count: 'exact' }),
        supabase.from('interviews').select('*', { count: 'exact' }),
        supabase.from('leave_requests').select('*').eq('status', 'pending'),
        supabase.from('resume_screenings').select('*', { count: 'exact' }),
      ]);

      return {
        totalEmployees: employees.count || 0,
        totalJobPostings: jobPostings.count || 0,
        totalInterviews: interviews.count || 0,
        pendingLeaves: leaveRequests.data?.length || 0,
        totalScreenings: screenings.count || 0,
      };
    },
  });

  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.totalEmployees || 0,
      icon: Users,
      gradient: 'bg-gradient-primary',
    },
    {
      title: 'Job Postings',
      value: stats?.totalJobPostings || 0,
      icon: Briefcase,
      gradient: 'bg-gradient-accent',
    },
    {
      title: 'Interviews',
      value: stats?.totalInterviews || 0,
      icon: Calendar,
      gradient: 'bg-gradient-primary',
    },
    {
      title: 'Pending Leaves',
      value: stats?.pendingLeaves || 0,
      icon: FileText,
      gradient: 'bg-gradient-accent',
    },
    {
      title: 'Resume Screenings',
      value: stats?.totalScreenings || 0,
      icon: TrendingUp,
      gradient: 'bg-gradient-primary',
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">HR Dashboard</h2>
        <p className="text-sm md:text-base text-muted-foreground">Recruitment and employee management</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`w-10 h-10 ${stat.gradient} rounded-lg flex items-center justify-center shadow-glow`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a href="/employees" className="p-4 border rounded-lg hover:bg-accent transition-colors">
            <Users className="w-6 h-6 mb-2 text-primary" />
            <h3 className="font-semibold">Manage Employees</h3>
            <p className="text-sm text-muted-foreground">View and edit employee records</p>
          </a>
          <a href="/job-postings" className="p-4 border rounded-lg hover:bg-accent transition-colors">
            <Briefcase className="w-6 h-6 mb-2 text-primary" />
            <h3 className="font-semibold">Job Postings</h3>
            <p className="text-sm text-muted-foreground">Create and manage job listings</p>
          </a>
          <a href="/interviews" className="p-4 border rounded-lg hover:bg-accent transition-colors">
            <Calendar className="w-6 h-6 mb-2 text-primary" />
            <h3 className="font-semibold">Interviews</h3>
            <p className="text-sm text-muted-foreground">Schedule and track interviews</p>
          </a>
          <a href="/resume-screening" className="p-4 border rounded-lg hover:bg-accent transition-colors">
            <TrendingUp className="w-6 h-6 mb-2 text-primary" />
            <h3 className="font-semibold">Resume Screening</h3>
            <p className="text-sm text-muted-foreground">Legacy resume analysis</p>
          </a>
          <a href="/candidate-resume-upload" className="p-4 border rounded-lg hover:bg-accent transition-colors bg-gradient-primary text-white">
            <Brain className="w-6 h-6 mb-2" />
            <h3 className="font-semibold">AI Resume Analysis</h3>
            <p className="text-sm opacity-90">Advanced AI insights & ranking</p>
          </a>
          <a href="/recruitment-analytics" className="p-4 border rounded-lg hover:bg-accent transition-colors">
            <BarChart3 className="w-6 h-6 mb-2 text-primary" />
            <h3 className="font-semibold">Recruitment Analytics</h3>
            <p className="text-sm text-muted-foreground">AI-powered hiring insights</p>
          </a>
            </CardContent>
          </Card>
        </div>
        <div>
          <RoleBasedChatAssistant />
        </div>
      </div>
    </div>
  );
};
