import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BrainCircuit, Upload, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ResumeScreening = () => {
  const [resumeText, setResumeText] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [position, setPosition] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: screenings, isLoading } = useQuery({
    queryKey: ['resume-screenings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resume_screenings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const analyzeResumeMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          resumeText,
          position,
          candidateName,
          candidateEmail,
          candidatePhone,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-screenings'] });
      toast({
        title: 'Resume analyzed!',
        description: 'AI analysis completed successfully',
      });
      setResumeText('');
      setCandidateName('');
      setCandidateEmail('');
      setCandidatePhone('');
      setPosition('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    await analyzeResumeMutation.mutateAsync();
    setIsAnalyzing(false);
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-success">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-primary">Good</Badge>;
    if (score >= 40) return <Badge className="bg-warning">Average</Badge>;
    return <Badge variant="destructive">Below Average</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center shadow-accent-glow">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              AI Resume Screening
            </h1>
          </div>
          <p className="text-muted-foreground">Let AI analyze candidate resumes instantly</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Upload Resume</CardTitle>
              <CardDescription>Paste resume text or upload a file</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="candidate-name">Candidate Name *</Label>
                  <Input
                    id="candidate-name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidate-email">Email *</Label>
                  <Input
                    id="candidate-email"
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="candidate-phone">Phone</Label>
                  <Input
                    id="candidate-phone"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position Applied *</Label>
                  <Input
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume-text">Resume Text *</Label>
                  <Textarea
                    id="resume-text"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste the resume text here..."
                    className="min-h-[200px]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-accent shadow-accent-glow"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="w-4 h-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Enter Candidate Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill in the candidate's information and the position they're applying for
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Paste Resume Text</h3>
                  <p className="text-sm text-muted-foreground">
                    Copy and paste the resume content into the text area
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI will analyze skills, experience, and fit for the position
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-accent">4</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Get Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive a detailed analysis with a match score and recommendations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Screenings</CardTitle>
            <CardDescription>View AI-analyzed candidate profiles</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>AI Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {screenings?.map((screening) => (
                    <TableRow key={screening.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{screening.candidate_name}</p>
                          <p className="text-sm text-muted-foreground">{screening.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{screening.position_applied}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">{screening.ai_score}</span>
                          {screening.ai_score && getScoreBadge(screening.ai_score)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={screening.status === 'approved' ? 'default' : 'secondary'}>
                          {screening.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(screening.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResumeScreening;
