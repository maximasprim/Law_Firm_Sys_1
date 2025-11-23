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
    title: "Corporate & Commercial Law",
    description:
      "Legal advisory for companies, startups, and SMEs in Kenya, including compliance with the Companies Act, commercial contracts, and business transactions.",
    features: [
      "Company Registration & Compliance",
      "Commercial Contracts",
      "Mergers & Acquisitions",
      "Corporate Governance",
    ],
  },
  {
    icon: Shield,
    title: "Litigation & Dispute Resolution",
    description:
      "Representation before Kenyan courts, tribunals, and arbitration panels in civil, commercial, and constitutional matters.",
    features: [
      "Civil Litigation",
      "Commercial Disputes",
      "Arbitration & Mediation",
      "Constitutional Petitions",
    ],
  },
  {
    icon: Users,
    title: "Family & Child Law",
    description:
      "Legal support for family-related matters under the Marriage Act, Children Act, and Matrimonial Property Act.",
    features: [
      "Divorce & Separation",
      "Child Custody & Maintenance",
      "Adoption Services",
      "Matrimonial Property",
    ],
  },
  {
    icon: Award,
    title: "Estate Planning & Succession",
    description:
      "Guidance on wills, succession matters, and estate administration under Kenyan succession laws.",
    features: [
      "Wills & Trusts",
      "Probate & Letters of Administration",
      "Estate Distribution",
      "Asset Protection",
    ],
  },
  {
    icon: Home,
    title: "Real Estate & Property Law",
    description:
      "Legal assistance for land transactions, property disputes, and conveyancing in line with the Land Act and Land Registration Act.",
    features: [
      "Conveyancing",
      "Lease Agreements",
      "Land Disputes",
      "Title Search & Verification",
    ],
  },
  {
    icon: FileText,
    title: "Intellectual Property Law",
    description:
      "Protection of creative works, brands, and innovations under KIPI (Kenya Industrial Property Institute) regulations.",
    features: [
      "Trademark Registration",
      "Copyright Protection",
      "Patent Applications",
      "IP Enforcement",
    ],
  },
  {
    icon: Briefcase,
    title: "Employment & Labour Law",
    description:
      "Representation and advisory under the Employment Act, Labour Relations Act, and workplace regulations.",
    features: [
      "Employment Contracts",
      "Unfair Termination Claims",
      "Workplace Disputes",
      "Health & Safety Compliance",
    ],
  },
  {
    icon: HeartHandshake,
    title: "Personal Injury & Compensation",
    description:
      "Claims for accidents, medical negligence, workplace injuries, and insurance disputes.",
    features: [
      "Road Accident Claims",
      "Medical Negligence",
      "Workplace Injury Claims",
      "Insurance Disputes",
    ],
  },
  {
    icon: Gavel,
    title: "Criminal Defense",
    description:
      "Defense representation in criminal matters before Kenyan courts, including bail applications and trial defense.",
    features: [
      "Bail & Bond Applications",
      "White Collar Crime",
      "Sexual & Gender-Based Offenses",
      "Drug-Related Offenses",
    ],
  },
  {
    icon: TrendingUp,
    title: "Tax Advisory & Compliance",
    description:
      "Support with KRA compliance, tax planning, and disputes before the Tax Appeals Tribunal.",
    features: [
      "Tax Planning",
      "KRA Audits & Objections",
      "Tax Appeals Tribunal Representation",
      "Corporate Tax Advisory",
    ],
  },
  {
    icon: Car,
    title: "Immigration & Citizenship",
    description:
      "Services for permits, visas, citizenship, and immigration appeals under Kenyan immigration laws.",
    features: [
      "Work Permits & Passes",
      "Visa Applications",
      "Citizenship Applications",
      "Immigration Appeals",
    ],
  },
  {
    icon: Scale,
    title: "Insolvency & Debt Recovery",
    description:
      "Debt collection, corporate restructuring, and insolvency services for individuals and companies.",
    features: [
      "Debt Recovery",
      "Corporate Insolvency",
      "Bankruptcy Applications",
      "Creditors’ Rights",
    ],
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
              Comprehensive legal services across multiple practice areas. Our experienced advocates are ready to guide you through your legal challenges.
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
              Our experienced advocates are here to help. Schedule a free consultation to discuss your legal needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink to="/book-consultation">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
                  Free Consultation
                </Button>
              </NavLink>
              <NavLink to="/advocates">
                <Button size="lg" variant="outline">
                  Meet Our Advocates
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
