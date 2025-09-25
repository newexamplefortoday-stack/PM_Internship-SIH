import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, TrendingUp } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_theme(colors.primary.foreground)_1px,_transparent_0)] [background-size:20px_20px]" />
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shadow-glow">
              <Target className="h-6 w-6 text-secondary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">
              PM Internship Portal
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" className="border-primary-foreground/40 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground hover:text-primary rounded-lg transition-all duration-300">
                Login
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="outline" className="border-primary-foreground/40 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground hover:text-primary rounded-lg transition-all duration-300">
                Company Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg shadow-glow">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-6 py-2 mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-primary-foreground/90 font-medium">
              Government of India Initiative
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up">
            Shape Your Future with{" "}
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              PM Internship Program
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Discover personalized internship opportunities that match your skills, interests, and career goals. 
            Join thousands of youth building their professional future.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in">
            <Link to="/register">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg shadow-glow px-8 py-4 text-lg font-semibold">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/40 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground hover:text-primary rounded-lg px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
              >
                Already Registered?
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-secondary mr-2" />
                <span className="text-3xl font-bold text-primary-foreground">50K+</span>
              </div>
              <p className="text-primary-foreground/70">Youth Registered</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-8 w-8 text-secondary mr-2" />
                <span className="text-3xl font-bold text-primary-foreground">1000+</span>
              </div>
              <p className="text-primary-foreground/70">Internships Available</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-secondary mr-2" />
                <span className="text-3xl font-bold text-primary-foreground">95%</span>
              </div>
              <p className="text-primary-foreground/70">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;