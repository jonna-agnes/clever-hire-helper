import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Briefcase, LayoutDashboard, Users, ClipboardList, FileText, BrainCircuit, MessageSquare, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const { userRole, signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI HRMS
            </span>
          </Link>

          <div className="flex items-center space-x-1">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>

            {(userRole === 'admin' || userRole === 'hr') && (
              <>
                <Button
                  variant={isActive('/employees') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to="/employees">
                    <Users className="w-4 h-4 mr-2" />
                    Employees
                  </Link>
                </Button>
                <Button
                  variant={isActive('/attendance') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to="/attendance">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Attendance
                  </Link>
                </Button>
                <Button
                  variant={isActive('/resume-screening') ? 'default' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link to="/resume-screening">
                    <BrainCircuit className="w-4 h-4 mr-2" />
                    AI Resume
                  </Link>
                </Button>
              </>
            )}

            <Button
              variant={isActive('/performance') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/performance">
                <FileText className="w-4 h-4 mr-2" />
                Performance
              </Link>
            </Button>

            <Button
              variant={isActive('/chat-assistant') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/chat-assistant">
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Chat
              </Link>
            </Button>

            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
