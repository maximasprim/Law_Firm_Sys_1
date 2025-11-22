import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  Shield, 
  Users, 
  Award, 
  Building2, 
  FileText, 
  Home,
  Briefcase,
  HeartHandshake,
  Gavel,
  TrendingUp,
  Car
} from "lucide-react";
import { NavLink } from "@/components/NavLink";

const PracticeAreas = () => {
  const practiceAreas = [
    {
      icon: Building2,
      title: "Corporate Law",
      description: "Comprehensive legal solutions for businesses of all sizes, including mergers and acquisitions, corporate governance, and contract negotiations.",
      features: ["M&A Advisory", "Corporate Governance", "Contract Review", "Compliance"],
    },
    {
      icon: Shield,
      title: "Litigation & Dispute Resolution",
      description: "Expert representation in complex civil, commercial, and criminal litigation matters with a proven track record of success.",
      features: ["Civil Litigation", "Commercial Disputes", "Arbitration", "Appeals"],
    },
    {
      icon: Users,
      title: "Family Law",
      description: "Compassionate guidance through divorce, child custody, adoption, and all family-related legal matters.",
      features: ["Divorce", "Child Custody", "Adoption", "Prenuptial Agreements"],
    },
    {
      icon: Award,
      title: "Estate Planning",
      description: "Protect your legacy and ensure your wishes are honored with comprehensive estate planning and trust services.",
      features: ["Wills & Trusts", "Probate", "Elder Law", "Asset Protection"],
    },
    {
      icon: Home,
      title: "Real Estate Law",
      description: "Full-service real estate legal support for residential and commercial transactions, disputes, and development.",
      features: ["Property Transactions", "Lease Agreements", "Zoning", "Title Issues"],
    },
    {
      icon: FileText,
      title: "Intellectual Property",
      description: "Protect your innovations, brands, and creative works with comprehensive IP legal services.",
      features: ["Patents", "Trademarks", "Copyrights", "IP Litigation"],
    },
    {
      icon: Briefcase,
      title: "Employment Law",
      description: "Expert guidance on workplace issues for both employers and employees.",
      features: ["Employment Contracts", "Wrongful Termination", "Discrimination", "Wage Disputes"],
    },
    {
      icon: HeartHandshake,
      title: "Personal Injury",
      description: "Fight for fair compensation after accidents, injuries, and wrongful death cases.",
      features: ["Auto Accidents", "Medical Malpractice", "Workplace Injuries", "Product Liability"],
    },
    {
      icon: Gavel,
      title: "Criminal Defense",
      description: "Aggressive defense representation for all types of criminal charges.",
      features: ["White Collar Crime", "DUI/DWI", "Drug Offenses", "Assault & Battery"],
    },
    {
      icon: TrendingUp,
      title: "Tax Law",
      description: "Navigate complex tax issues with strategic planning and dispute resolution.",
      features: ["Tax Planning", "IRS Disputes", "Tax Litigation", "International Tax"],
    },
    {
      icon: Car,
      title: "Immigration Law",
      description: "Comprehensive immigration services for individuals, families, and businesses.",
      features: ["Visas", "Green Cards", "Citizenship", "Deportation Defense"],
    },
    {
      icon: Scale,
      title: "Bankruptcy",
      description: "Strategic solutions for debt relief and financial restructuring.",
      features: ["Chapter 7", "Chapter 11", "Chapter 13", "Creditor Rights"],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Practice Areas
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Comprehensive legal services across multiple practice areas. Our experienced attorneys are ready to guide you through your legal challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Practice Areas Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {practiceAreas.map((area, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-elegant transition-all duration-300 border-border hover:border-accent animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-accent group-hover:shadow-gold transition-all duration-300">
                    <area.icon className="h-8 w-8 text-primary group-hover:text-accent-foreground" />
                  </div>
                  <h3 className="text-2xl font-display font-semibold mb-3 text-foreground">
                    {area.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {area.description}
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-primary mb-2">Key Services:</div>
                    <ul className="space-y-1">
                      {area.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
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
              Need Legal Assistance?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our experienced attorneys are here to help. Schedule a free consultation to discuss your legal needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink to="/contact">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
                  Free Consultation
                </Button>
              </NavLink>
              <NavLink to="/attorneys">
                <Button size="lg" variant="outline">
                  Meet Our Attorneys
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PracticeAreas;
