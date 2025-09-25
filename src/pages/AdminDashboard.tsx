import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Users, CheckCircle, Clock, XCircle, Building2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Application {
  id: string;
  status: string;
  applied_at: string;
  compatibility_score: number;
  internship: {
    id: string;
    title: string;
    required_skills: string[];
  };
  profile: {
    name: string;
    age: number;
    mobile: string;
    email: string;
    education: string;
    location: string;
    skills: string[];
  };
}

const AdminDashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    const storedAdminData = localStorage.getItem('adminData');
    
    if (!adminSession || !storedAdminData) {
      navigate('/admin/login');
      return;
    }

    const session = JSON.parse(adminSession);
    if (new Date(session.expires_at) <= new Date()) {
      localStorage.removeItem('adminSession');
      localStorage.removeItem('adminData');
      navigate('/admin/login');
      return;
    }

    setAdminData(JSON.parse(storedAdminData));
    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const adminSession = localStorage.getItem('adminSession');
      if (!adminSession) return;

      const { data, error } = await supabase.functions.invoke('admin-operations', {
        body: { action: 'fetch_applications' }
      });

      if (error) throw error;

      setApplications(data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const application = applications.find(app => app.id === applicationId);
      if (!application) return;

      // 🔗 Call n8n webhook
      await fetch("https://rudrapatel123.app.n8n.cloud/webhook-test/adminapproval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          student_id: application.id,
          student_name: application.profile.name,
          email: application.profile.email,
          internship: application.internship?.title,
          company: adminData?.company_name,
          status: newStatus
        })
      });

      // Update Supabase (optional sync with DB)
      const { error } = await supabase.functions.invoke('admin-operations', {
        body: { 
          action: 'update_status',
          applicationId,
          newStatus 
        }
      });

      if (error) throw error;

      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));

      toast({
        title: "Success",
        description: `Application ${newStatus} successfully`,
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getStatusCounts = () => {
    const pending = applications.filter(app => app.status === 'pending').length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    return { pending, approved, rejected, total: applications.length };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">{adminData?.company_name}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Internship Applications</CardTitle>
            <CardDescription>
              Manage applications for your company's internships
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No applications have been submitted yet.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Internship</TableHead>
                    <TableHead>Match %</TableHead>
                    <TableHead>Education</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{application.profile.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Age: {application.profile.age} • {application.profile.mobile}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {application.profile.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {application.internship.title}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`${
                            application.compatibility_score >= 80 ? 'bg-green-100 text-green-800' :
                            application.compatibility_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {application.compatibility_score}%
                        </Badge>
                      </TableCell>
                      <TableCell>{application.profile.education}</TableCell>
                      <TableCell>{application.profile.location}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {application.profile.skills?.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {application.profile.skills?.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{application.profile.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(application.applied_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {application.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(application.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(application.id, 'rejected')}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
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

export default AdminDashboard;
