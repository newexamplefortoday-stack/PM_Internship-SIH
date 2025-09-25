import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, IndianRupee, BookOpen, Briefcase, Award } from "lucide-react";

const benefits = [
  {
    icon: IndianRupee,
    title: "Competitive Stipend",
    description: "Earn up to ₹30,000 per month while gaining valuable experience",
    highlight: "Financial Support",
    color: "text-secondary"
  },
  {
    icon: BookOpen,
    title: "Skill Development",
    description: "Learn industry-relevant skills through hands-on projects and mentorship",
    highlight: "Professional Growth",
    color: "text-primary"
  },
  {
    icon: Briefcase,
    title: "Career Opportunities",
    description: "Access to full-time job opportunities and professional networks",
    highlight: "Future Ready",
    color: "text-secondary"
  },
  {
    icon: Award,
    title: "Government Recognition",
    description: "Official certification and recognition from Government of India",
    highlight: "Certified Program",
    color: "text-primary"
  }
];

const BenefitsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % benefits.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + benefits.length) % benefits.length);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Why Choose PM Internship Program?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the comprehensive benefits that make our program the perfect launchpad for your career
          </p>
        </div>

        {/* Desktop Carousel */}
        <div className="hidden md:block relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="w-full flex-shrink-0">
                    <Card className="mx-4 shadow-elegant bg-gradient-to-br from-card to-accent">
                      <CardContent className="p-12 text-center">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent mb-6 shadow-card ${benefit.color}`}>
                          <IconComponent className="h-10 w-10" />
                        </div>
                        <div className="inline-block px-4 py-1 bg-secondary/10 text-secondary text-sm font-semibold rounded-full mb-4">
                          {benefit.highlight}
                        </div>
                        <h3 className="text-2xl font-bold text-primary mb-4">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                          {benefit.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 p-0 shadow-card hover:shadow-elegant"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 p-0 shadow-card hover:shadow-elegant"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {benefits.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-secondary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Grid */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-shadow animate-scale-in">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-4 shadow-card ${benefit.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full mb-3">
                    {benefit.highlight}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsCarousel;