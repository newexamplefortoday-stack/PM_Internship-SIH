import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User, GraduationCap, MapPin, Heart, Search } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    education: "",
    skills: "",
    location: "",
    interests: ""
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [cities, setCities] = useState<Array<{id: string, name: string, state: string}>>([]);
  const [filteredCities, setFilteredCities] = useState<Array<{id: string, name: string, state: string}>>([]);
  const [citySearch, setCitySearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { icon: User, title: "Personal Info", fields: ["name", "age", "email", "mobile", "password", "confirmPassword"] },
    { icon: GraduationCap, title: "Education", fields: ["education"] },
    { icon: MapPin, title: "Location & Skills", fields: ["location", "skills"] },
    { icon: Heart, title: "Interests", fields: ["interests"] }
  ];

  // Don't redirect during registration flow - let users complete their profile

  // Fetch cities on component mount
  useEffect(() => {
    fetchCities();
  }, []);

  // Filter cities based on search
  useEffect(() => {
    if (citySearch.trim()) {
      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(citySearch.toLowerCase()) ||
        city.state.toLowerCase().includes(citySearch.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities.slice(0, 10)); // Show first 10 cities by default
    }
  }, [citySearch, cities]);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setCities(data || []);
      setFilteredCities((data || []).slice(0, 10));
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please ensure both passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.mobile || formData.mobile.length !== 10) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, {
        name: formData.name,
        age: parseInt(formData.age),
        mobile: formData.mobile,
        education: formData.education,
        location: formData.location,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        interests: [formData.interests]
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account Already Exists",
            description: "This email address is already registered. Please login instead.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Registration Failed",
            description: error.message || "An error occurred during registration.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Registration Successful!",
          description: "Please check your email and click the verification link before logging in.",
        });
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const CurrentStepIcon = steps[currentStep - 1].icon;

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_theme(colors.primary.foreground)_1px,_transparent_0)] [background-size:20px_20px]" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-primary-foreground hover:text-primary-foreground/80 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
          <div className="text-primary-foreground/80 text-sm">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <Card className="mb-8 shadow-card animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-full bg-secondary shadow-glow">
                  <CurrentStepIcon className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-primary">
                    {steps[currentStep - 1].title}
                  </h2>
                  <p className="text-muted-foreground">Complete your profile</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Profile Completion</span>
                  <span className="font-medium text-primary">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card className="shadow-elegant animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">
                Youth Registration Portal
              </CardTitle>
              <p className="text-muted-foreground">
                Shape your future with PM Internship Program
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Enter your age"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: e.target.value})}
                          required
                          min="18"
                          max="35"
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="Enter your 10-digit mobile number"
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                          minLength={6}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          required
                          minLength={6}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Education */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="education">Education Level *</Label>
                      <Select 
                        value={formData.education} 
                        onValueChange={(value) => setFormData({...formData, education: value})}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select your education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12th">12th Standard</SelectItem>
                          <SelectItem value="diploma">Diploma</SelectItem>
                          <SelectItem value="graduation">Graduation</SelectItem>
                          <SelectItem value="postgraduation">Post Graduation</SelectItem>
                          <SelectItem value="professional">Professional Course</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 3: Location & Skills */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="location">Preferred Location *</Label>
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search for a city..."
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          className="pl-10 rounded-lg"
                        />
                      </div>
                      <Select
                        value={formData.location}
                        onValueChange={(value) => setFormData({...formData, location: value})}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select preferred location" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredCities.map((city) => (
                            <SelectItem key={city.id} value={city.name}>
                              {city.name}, {city.state}
                            </SelectItem>
                          ))}
                          {filteredCities.length === 0 && citySearch && (
                            <SelectItem value="" disabled>
                              No cities found
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills *</Label>
                      <Input
                        id="skills"
                        type="text"
                        placeholder="e.g., Data Analysis, Marketing, Programming (comma-separated)"
                        value={formData.skills}
                        onChange={(e) => setFormData({...formData, skills: e.target.value})}
                        required
                        className="rounded-lg"
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate multiple skills with commas
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Interests */}
                {currentStep === 4 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="interests">Areas of Interest *</Label>
                      <Select
                        value={formData.interests}
                        onValueChange={(value) => setFormData({...formData, interests: value})}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select your area of interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology & IT</SelectItem>
                          <SelectItem value="finance">Finance & Banking</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="marketing">Marketing & Sales</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="design">Design & Creative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="rounded-lg"
                  >
                    Previous
                  </Button>
                  
                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="rounded-lg bg-gradient-primary hover:opacity-90"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-lg bg-gradient-secondary hover:opacity-90"
                    >
                      {isLoading ? "Registering..." : "Complete Registration"}
                    </Button>
                  )}
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                    Login here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;