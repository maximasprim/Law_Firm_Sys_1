import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, DollarSign, Users, TrendingUp, Heart, Award } from "lucide-react";

const Careers = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      description: "Industry-leading salaries with performance bonuses and profit sharing opportunities.",
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance plus wellness programs.",
    },
    {
      icon: TrendingUp,
      title: "Professional Development",
      description: "CLE credits, mentorship programs, and continuing education support.",
    },
    {
      icon: Clock,
      title: "Work-Life Balance",
      description: "Flexible schedules, remote work options, and generous PTO policy.",
    },
  ];

  const positions = [
    {
      title: "Senior Associate - Corporate Law",
      department: "Corporate",
      location: "New York, NY",
      type: "Full-time",
      experience: "5-7 years",
      description: "Seeking an experienced corporate attorney to join our M&A team. Handle complex transactions, securities work, and corporate governance matters.",
      requirements: [
        "J.D. from top-tier law school",
        "5-7 years of corporate law experience",
        "Strong M&A background",
        "Excellent communication skills",
      ],
    },
    {
      title: "Litigation Associate",
      department: "Litigation",
      location: "New York, NY",
      type: "Full-time",
      experience: "3-5 years",
      description: "Join our litigation team handling complex commercial disputes. Opportunity to take depositions, conduct trials, and work on high-stakes matters.",
      requirements: [
        "3-5 years litigation experience",
        "Trial experience preferred",
        "Strong research and writing skills",
        "Ability to manage multiple matters",
      ],
    },
    {
      title: "Intellectual Property Associate",
      department: "IP Law",
      location: "New York, NY",
      type: "Full-time",
      experience: "2-4 years",
      description: "Handle patent prosecution, trademark matters, and IP litigation. Work with innovative technology clients.",
      requirements: [
        "Technical undergraduate degree preferred",
        "Patent bar admission or eligibility",
        "2-4 years IP experience",
        "Client management skills",
      ],
    },
    {
      title: "Paralegal - Family Law",
      department: "Family Law",
      location: "New York, NY",
      type: "Full-time",
      experience: "3+ years",
      description: "Support our family law attorneys with case management, document preparation, and client communication.",
      requirements: [
        "Paralegal certificate or equivalent",
        "3+ years family law experience",
        "Proficient in legal research",
        "Excellent organizational skills",
      ],
    },
    {
      title: "Legal Secretary",
      department: "Administration",
      location: "New York, NY",
      type: "Full-time",
      experience: "2+ years",
      description: "Provide administrative support to our legal team. Manage calendars, draft correspondence, and coordinate meetings.",
      requirements: [
        "2+ years legal secretary experience",
        "Proficient in MS Office",
        "Strong attention to detail",
        "Excellent communication skills",
      ],
    },
    {
      title: "Summer Associate",
      department: "Multiple",
      location: "New York, NY",
      type: "Internship",
      experience: "Law Student",
      description: "10-week paid summer program for current law students. Rotate through practice groups and work on real matters.",
      requirements: [
        "Current law student (1L/2L)",
        "Top academic credentials",
        "Law review or journal experience preferred",
        "Strong research and writing skills",
      ],
    },
  ];

  const values = [
    {
      icon: Users,
      title: "Collaborative Culture",
      description: "Work alongside some of the brightest legal minds in a supportive, team-oriented environment.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We set the highest standards and provide the resources you need to deliver exceptional work.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl opacity-90 leading-relaxed mb-8">
              Build your career with one of the nation's premier law firms. We're always looking for talented individuals who share our commitment to excellence.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
              View Open Positions
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-primary mb-4">
              Why Owino Kojo Advocates?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We invest in our people and create an environment where talent thrives
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-elegant transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg flex-shrink-0">
                      <value.icon className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-primary mb-4">
              Benefits & Perks
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive benefits designed to support your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="mb-4 mx-auto p-4 bg-primary/10 rounded-full w-fit hover:bg-accent hover:shadow-gold transition-all duration-300 group">
                    <benefit.icon className="h-8 w-8 text-primary group-hover:text-accent-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-primary mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore opportunities to grow your legal career
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {positions.map((position, index) => (
              <Card
                key={index}
                className="hover:shadow-elegant transition-all duration-300 border-border hover:border-accent animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
                        {position.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <Badge variant="secondary">{position.department}</Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="h-4 w-4" />
                          {position.type}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {position.experience}
                        </div>
                      </div>

                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {position.description}
                      </p>

                      <div>
                        <div className="text-sm font-semibold text-foreground mb-2">Requirements:</div>
                        <ul className="space-y-1">
                          {position.requirements.map((req, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Button className="bg-accent text-accent-foreground hover:bg-accent/90 w-full lg:w-auto">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Don't See the Right Position?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              We're always interested in hearing from talented legal professionals. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
              Submit Your Resume
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
