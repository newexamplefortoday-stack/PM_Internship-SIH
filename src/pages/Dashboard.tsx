import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { LogOut, MapPin, DollarSign, Calendar, Star, Search, Filter } from 'lucide-react';

interface Internship {
  id: string;
  title: string;
  company_name: string;
  company_logo: string;
  location: string;
  stipend: number;
  duration_months: number;
  required_skills: string[];
  description: string;
  eligibility_criteria: string[];
  benefits: string[];
  application_deadline: string;
  compatibility_score?: number;
}

interface UserProfile {
  location: string;
  skills: string[];
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [stipendFilter, setStipendFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('location, skills')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
      }

      // Fetch internships
      const { data: internshipsData, error } = await supabase
        .from('internships')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (internshipsData && profile) {
        // Calculate compatibility scores
        const internshipsWithScores = internshipsData.map(internship => ({
          ...internship,
          compatibility_score: calculateCompatibilityScore(internship, profile)
        }));

        // Sort by compatibility score
        internshipsWithScores.sort((a, b) => (b.compatibility_score || 0) - (a.compatibility_score || 0));
        setInternships(internshipsWithScores);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load internships. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCompatibilityScore = (internship: any, profile: UserProfile): number => {
    let score = 0;
    
    // Location match (40% weight)
    if (profile.location && internship.location) {
      const userLoc = profile.location.toLowerCase();
      const internshipLoc = internship.location.toLowerCase();
      if (userLoc === internshipLoc || userLoc.includes(internshipLoc) || internshipLoc.includes(userLoc)) {
        score += 40;
      }
    }
    
    // Skills match (60% weight)
    if (profile.skills && internship.required_skills) {
      const userSkills = profile.skills.map(skill => skill.toLowerCase());
      const requiredSkills = internship.required_skills.map(skill => skill.toLowerCase());
      const matchingSkills = requiredSkills.filter(skill => 
        userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
      );
      
      if (requiredSkills.length > 0) {
        score += (matchingSkills.length / requiredSkills.length) * 60;
      }
    }
    
    return Math.round(score);
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.'
    });
  };

  const handleApply = async (internshipId: string) => {
    if (!user) return;

    try {
      // Insert into Supabase
      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          internship_id: internshipId
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: 'Already Applied',
            description: 'You have already applied for this internship.',
            variant: 'destructive'
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Application Submitted',
          description: 'Your application has been submitted successfully!'
        });

        // --- N8N WEBHOOK INTEGRATION ---
        const internship = internships.find(i => i.id === internshipId);
        
        // ** ACTION REQUIRED: Replace the placeholder URL below with your actual n8n webhook URL. **
        const webhookUrl = "https://rudrapatel123.app.n8n.cloud/webhook-test/apply-internship";

        if (webhookUrl !== "YOUR_N8N_WEBHOOK_URL_HERE") {
            await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: user.id,
                internship_id: internshipId,
                internship_title: internship?.title, 
                company_name: internship?.company_name,
              })
            });
        } else {
            console.warn("n8n webhook URL is not configured. Please replace the placeholder in Dashboard.tsx.");
        }
        // --- END OF N8N INTEGRATION ---
      }
    } catch (error) {
      console.error('Error applying:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          internship.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === 'all' || internship.location === locationFilter;
    
    const matchesStipend = stipendFilter === 'all' || 
                           (stipendFilter === 'low' && internship.stipend < 20000) ||
                           (stipendFilter === 'medium' && internship.stipend >= 20000 && internship.stipend < 25000) ||
                           (stipendFilter === 'high' && internship.stipend >= 25000);

    return matchesSearch && matchesLocation && matchesStipend;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">PM Internship Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, find your perfect internship match!</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Internships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={stipendFilter} onValueChange={setStipendFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by stipend" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stipends</SelectItem>
                  <SelectItem value="low">Below ₹20,000</SelectItem>
                  <SelectItem value="medium">₹20,000 - ₹25,000</SelectItem>
                  <SelectItem value="high">Above ₹25,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Internships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((internship, index) => (
            <Card 
              key={internship.id} 
              className={`hover:shadow-lg transition-shadow ${index === 0 ? 'border-primary shadow-lg' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-secondary-foreground">
                        {internship.company_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{internship.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{internship.company_name}</p>
                    </div>
                  </div>
                  {index === 0 && (
                    <Badge className="bg-gradient-primary text-primary-foreground">
                      Best Match
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Compatibility Score */}
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">
                    {internship.compatibility_score}% Match
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {internship.location}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    ₹{internship.stipend.toLocaleString()}/month
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {internship.duration_months} months
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-sm font-medium mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {internship.required_skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {internship.required_skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{internship.required_skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {internship.description}
                </p>

                {/* Apply Button */}
                <Button 
                  onClick={() => handleApply(internship.id)}
                  className="w-full"
                  variant={index === 0 ? "default" : "outline"}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInternships.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No internships found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
