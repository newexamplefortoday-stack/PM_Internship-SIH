import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Users, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const eligibilityItems = [
  {
    icon: Calendar,
    title: "Age Criteria",
    requirement: "18-35 years",
    description: "Open to youth in the productive age group",
    isRequired: true,
    color: "text-primary"
  },
  {
    icon: Briefcase,
    title: "Employment Status",
    requirement: "Unemployed/Underemployed",
    description: "For those seeking better career opportunities",
    isRequired: true,
    color: "text-secondary"
  },
  {
    icon: GraduationCap,
    title: "Education",
    requirement: "12th pass or above",
    description: "Minimum qualification required for participation",
    isRequired: true,
    color: "text-primary"
  },
  {
    icon: Users,
    title: "Family Income",
    requirement: "Below ₹8 Lakh annually",
    description: "Priority given to economically weaker sections",
    isRequired: false,
    color: "text-secondary"
  }
];

const EligibilityCriteria = () => {
  return (
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Eligibility Criteria
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Check if you meet the requirements to join PM Internship Program
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {eligibilityItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={index} 
                className="relative shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-slide-up group overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center relative z-10">
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {item.isRequired ? (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <CheckCircle2 className="h-3 w-3" />
                        Required
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-xs">
                        <AlertCircle className="h-3 w-3" />
                        Preferred
                      </Badge>
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4 shadow-card group-hover:shadow-glow transition-shadow ${item.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-primary mb-2">
                    {item.title}
                  </h3>

                  {/* Requirement */}
                  <div className="bg-primary/5 rounded-lg px-3 py-2 mb-3">
                    <p className="font-semibold text-primary text-sm">
                      {item.requirement}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>

                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10 shadow-card">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-glow">
                  <CheckCircle2 className="h-6 w-6 text-secondary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">
                Ready to Check Your Eligibility?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our registration process includes an automated eligibility check. 
                If you meet the basic criteria, you can proceed with your application immediately.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="text-xs">Indian Citizen</Badge>
                <Badge variant="outline" className="text-xs">Valid ID Required</Badge>
                <Badge variant="outline" className="text-xs">Bank Account Needed</Badge>
                <Badge variant="outline" className="text-xs">Basic Digital Literacy</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EligibilityCriteria;