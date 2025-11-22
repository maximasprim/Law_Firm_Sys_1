import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Linkedin, Award } from "lucide-react";

const Attorneys = () => {
  const attorneys = [
    {
      name: "Michael Harrison",
      title: "Managing Partner",
      specialization: "Corporate Law & M&A",
      experience: "25+ years",
      education: "Harvard Law School, J.D.",
      achievements: ["Super Lawyers (10 years)", "Best Lawyers in America", "AV Preeminent Rated"],
      bio: "Michael specializes in complex corporate transactions and has advised Fortune 500 companies on multi-billion dollar mergers and acquisitions.",
      email: "m.harrison@premierlaw.com",
      phone: "(212) 555-0124",
    },
    {
      name: "Sarah Chen",
      title: "Senior Partner",
      specialization: "Litigation & Dispute Resolution",
      experience: "20+ years",
      education: "Yale Law School, J.D.",
      achievements: ["Trial Lawyer of the Year", "Top 40 Under 40", "Chambers USA Ranked"],
      bio: "Sarah has successfully litigated hundreds of complex commercial disputes with a 95% success rate in trial and arbitration.",
      email: "s.chen@premierlaw.com",
      phone: "(212) 555-0125",
    },
    {
      name: "David Martinez",
      title: "Senior Partner",
      specialization: "Intellectual Property",
      experience: "18+ years",
      education: "Stanford Law School, J.D.",
      achievements: ["IP Law Trailblazer", "Patent Litigation Star", "IAM Patent 1000"],
      bio: "David protects innovation for technology companies and has secured over 500 patents for clients in various industries.",
      email: "d.martinez@premierlaw.com",
      phone: "(212) 555-0126",
    },
    {
      name: "Emily Thompson",
      title: "Partner",
      specialization: "Family Law",
      experience: "15+ years",
      education: "Columbia Law School, J.D.",
      achievements: ["Best Lawyers Family Law", "Top Women Lawyers", "Martindale-Hubbell Distinguished"],
      bio: "Emily provides compassionate yet strategic representation in complex divorce, custody, and family law matters.",
      email: "e.thompson@premierlaw.com",
      phone: "(212) 555-0127",
    },
    {
      name: "Robert Williams",
      title: "Partner",
      specialization: "Real Estate Law",
      experience: "16+ years",
      education: "NYU School of Law, J.D.",
      achievements: ["Real Estate Deal Maker of the Year", "Best Lawyers Real Estate", "Commercial Observer Power 50"],
      bio: "Robert handles sophisticated commercial real estate transactions and development projects across the nation.",
      email: "r.williams@premierlaw.com",
      phone: "(212) 555-0128",
    },
    {
      name: "Jennifer Kim",
      title: "Partner",
      specialization: "Employment Law",
      experience: "14+ years",
      education: "UC Berkeley Law, J.D.",
      achievements: ["Employment Rights Advocate Award", "Top Labor Attorney", "Best Lawyers Employment Law"],
      bio: "Jennifer advocates for both employers and employees in complex workplace disputes and policy development.",
      email: "j.kim@premierlaw.com",
      phone: "(212) 555-0129",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Our Attorneys
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Meet our team of experienced legal professionals dedicated to achieving exceptional results for our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "50+", label: "Expert Attorneys" },
              { value: "200+", label: "Years Combined Experience" },
              { value: "100+", label: "Industry Awards" },
              { value: "5,000+", label: "Cases Won" },
            ].map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl font-display font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attorneys Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attorneys.map((attorney, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-elegant transition-all duration-300 border-border hover:border-accent animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  {/* Avatar Placeholder */}
                  <div className="w-full aspect-square mb-4 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <div className="text-6xl font-display font-bold text-primary-foreground">
                      {attorney.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>

                  <h3 className="text-2xl font-display font-semibold text-foreground mb-1">
                    {attorney.name}
                  </h3>
                  <p className="text-accent font-semibold mb-2">{attorney.title}</p>
                  
                  <div className="space-y-2 mb-4">
                    <Badge variant="secondary" className="mr-2">
                      {attorney.specialization}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{attorney.experience} experience</p>
                    <p className="text-sm text-muted-foreground">{attorney.education}</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {attorney.bio}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-primary">
                      <Award className="h-4 w-4" />
                      <span>Achievements</span>
                    </div>
                    <ul className="space-y-1">
                      {attorney.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="h-1 w-1 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <a href={`mailto:${attorney.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Mail className="h-4 w-4" />
                      {attorney.email}
                    </a>
                    <a href={`tel:${attorney.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Phone className="h-4 w-4" />
                      {attorney.phone}
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn Profile
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
              Schedule a Consultation
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with one of our experienced attorneys to discuss your legal needs.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
              Book Free Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Attorneys;
