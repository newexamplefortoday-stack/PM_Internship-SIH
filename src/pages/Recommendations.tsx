import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Building2, 
  Star, 
  Filter,
  LogOut,
  User,
  Trophy
} from "lucide-react";

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  stipend: number;
  duration: string;
  skills: string[];
  matchPercentage: number;
  isTopRecommendation: boolean;
  description: string;
  requirements: string[];
}

const Recommendations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [stipendFilter, setStipendFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");

  // Mock internship data
  const [internships] = useState<Internship[]>([
    {
      id: "1",
      title: "Data Analytics Intern",
      company: "TechCorp India",
      location: "Bangalore",
      stipend: 25000,
      duration: "6 months",
      skills: ["Data Analysis", "Python", "SQL"],
      matchPercentage: 95,
      isTopRecommendation: true,
      description: "Work on real-world data analytics projects with experienced mentors.",
      requirements: ["Python basics", "Statistics knowledge", "Excel proficiency"]
    },
    {
      id: "2",
      title: "Digital Marketing Intern",
      company: "MarketPro Solutions",
      location: "Mumbai",
      stipend: 20000,
      duration: "4 months",
      skills: ["Marketing", "Social Media", "Analytics"],
      matchPercentage: 87,
      isTopRecommendation: false,
      description: "Learn digital marketing strategies and campaign management.",
      requirements: ["Basic marketing knowledge", "Creative thinking", "Communication skills"]
    },
    {
      id: "3",
      title: "Software Development Intern",
      company: "InnovateTech",
      location: "Delhi NCR",
      stipend: 30000,
      duration: "6 months",
      skills: ["Programming", "JavaScript", "React"],
      matchPercentage: 82,
      isTopRecommendation: false,
      description: "Build modern web applications using latest technologies.",
      requirements: ["JavaScript basics", "HTML/CSS", "Problem solving"]
    },
    {
      id: "4",
      title: "Finance & Operations Intern",
      company: "FinanceFlow Ltd",
      location: "Hyderabad",
      stipend: 22000,
      duration: "5 months",
      skills: ["Finance", "Operations", "Excel"],
      matchPercentage: 78,
      isTopRecommendation: false,
      description: "Support financial operations and learn business processes.",
      requirements: ["Excel proficiency", "Analytical thinking", "Attention to detail"]
    }
  ]);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('pmPortalAuth');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load user data
    const userData = localStorage.getItem('pmPortalUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('pmPortalAuth');
    toast({
      title: "Logged out successfully",
      description: "Thank you for using PM Internship Portal!"
    });
    navigate('/');
  };

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "all" || internship.location === locationFilter;
    const matchesStipend = stipendFilter === "all" || 
                          (stipendFilter === "20000+" && internship.stipend >= 20000) ||
                          (stipendFilter === "25000+" && internship.stipend >= 25000) ||
                          (stipendFilter === "30000+" && internship.stipend >= 30000);
    const matchesSkill = skillFilter === "all" || 
                        internship.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));

    return matchesSearch && matchesLocation && matchesStipend && matchesSkill;
  });

  const topRecommendation = filteredInternships.find(i => i.isTopRecommendation);
  const otherRecommendations = filteredInternships.filter(i => !i.isTopRecommendation);

  if (!user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-elegant">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-primary-foreground">
              PM Internship Portal
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-primary-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium">{user.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Your Personalized Internship Recommendations
          </h1>
          <p className="text-muted-foreground">
            Based on your profile: {user.skills} • {user.location} • {user.interests}
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-card animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search internships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 rounded-lg"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Stipend</label>
                <Select value={stipendFilter} onValueChange={setStipendFilter}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stipends</SelectItem>
                    <SelectItem value="20000+">₹20,000+</SelectItem>
                    <SelectItem value="25000+">₹25,000+</SelectItem>
                    <SelectItem value="30000+">₹30,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Skills</label>
                <Select value={skillFilter} onValueChange={setSkillFilter}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="data">Data Analysis</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("all");
                    setStipendFilter("all");
                    setSkillFilter("all");
                  }}
                  className="w-full rounded-lg"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Recommendation */}
        {topRecommendation && (
          <div className="mb-8 animate-scale-in">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-6 w-6 text-secondary" />
              <h2 className="text-2xl font-bold text-primary">Best Match for You</h2>
            </div>
            
            <Card className="border-secondary/20 bg-gradient-to-r from-secondary/5 to-secondary/10 shadow-glow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-1">
                      {topRecommendation.title}
                    </h3>
                    <p className="text-lg font-semibold text-secondary mb-2">
                      {topRecommendation.company}
                    </p>
                  </div>
                  <Badge className="bg-secondary text-secondary-foreground text-lg px-3 py-1">
                    {topRecommendation.matchPercentage}% Match
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{topRecommendation.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span>₹{topRecommendation.stipend.toLocaleString()}/month</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{topRecommendation.duration}</span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{topRecommendation.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {topRecommendation.skills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="rounded-full">
                      {skill}
                    </Badge>
                  ))
                }
                </div>

                <Button className="w-full md:w-auto bg-gradient-secondary hover:opacity-90 rounded-lg">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6">More Recommendations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherRecommendations.map((internship) => (
              <Card key={internship.id} className="shadow-card hover:shadow-elegant transition-shadow animate-slide-up">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-primary mb-1">
                        {internship.title}
                      </h3>
                      <p className="font-semibold text-foreground mb-2">
                        {internship.company}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {internship.matchPercentage}% Match
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span>{internship.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <IndianRupee className="h-3 w-3 text-muted-foreground" />
                      <span>₹{internship.stipend.toLocaleString()}/month</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{internship.duration}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {internship.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {internship.skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs rounded-full">
                        {skill}
                      </Badge>
                    ))
                  }
                  </div>

                  <Button variant="outline" className="w-full rounded-lg hover:bg-primary hover:text-primary-foreground">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredInternships.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No internships found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setLocationFilter("all");
                  setStipendFilter("all");
                  setSkillFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
