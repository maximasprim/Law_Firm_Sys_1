import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Scale,
  Shield,
  Building2,
  FileText,
  Home,
  Briefcase,
  Gavel,
  TrendingUp,
  Users,
  CreditCard,
  ShieldCheck,
  Laptop
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import bg from '@/assets/act-vs-law.jpg';

const PracticeAreas = () => {
  const practiceAreas = [
    {
      icon: Shield,
      title: "Legal Risk Audit & Management",
      description:
        "Comprehensive identification, analysis, and monitoring of legal risks within your organization's internal and external environment.",
      features: [
        "Compliance Default Risk Assessment",
        "Employment Liability Risk Management",
        "Tax Compliance Risk Analysis",
        "Operational & Strategic Risk Management",
      ],
    },
    {
      icon: Building2,
      title: "Corporate Governance",
      description:
        "Expert consultancy on commerce, corporate governance, business development, and ensuring compliance with relevant laws and regulations.",
      features: [
        "Company & Partnership Registration",
        "Corporate Governance Consultancy",
        "Filing Returns & Compliance",
        "Board & Management Advisory",
      ],
    },
    {
      icon: CreditCard,
      title: "Banking & Financing Law",
      description:
        "Comprehensive legal services for banking transactions, loan agreements, and financial documentation.",
      features: [
        "Preparation & Registration of Charges",
        "Chattel Mortgages & Transfers",
        "Loan Syndication Agreements",
        "Debentures Registration",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Insurance Law",
      description:
        "Legal advisory and representation for insurance companies, policy holders, and re-insurance matters.",
      features: [
        "Policy Document Drafting",
        "Insurance Product Evaluation",
        "Declaratory Suits & Indemnity",
        "Re-insurance Legal Advisory",
      ],
    },
    {
      icon: Home,
      title: "Property Law",
      description:
        "Complete conveyancing services, property transactions, and estate management solutions.",
      features: [
        "Sale & Lease Agreement Preparation",
        "Transfer & Lease Registration",
        "Powers of Attorney & Caveats",
        "Estate Management Services",
      ],
    },
    {
      icon: TrendingUp,
      title: "Recoveries & Debt Management",
      description:
        "Effective debt recovery strategies, bankruptcy proceedings, and creditor representation.",
      features: [
        "Debt Recovery & Execution",
        "Bankruptcy & Liquidation",
        "Garnishee Proceedings",
        "Receivership & Management",
      ],
    },
    {
      icon: Laptop,
      title: "Information Technology Law",
      description:
        "Legal support for technology companies, software agreements, and digital commerce.",
      features: [
        "Software & Support Agreements",
        "Web Hosting Agreements",
        "E-Commerce & M-Commerce Law",
        "Escrow & Distribution Agreements",
      ],
    },
    {
      icon: FileText,
      title: "Intellectual Property Law",
      description:
        "Protection and registration of trademarks, copyrights, patents, and IP litigation services.",
      features: [
        "Trademark Registration",
        "Copyright Registration",
        "Patent Registration",
        "IP Litigation & Legal Opinions",
      ],
    },
    {
      icon: Users,
      title: "Human Resource Law",
      description:
        "Comprehensive employment law services, from policy development to dispute resolution.",
      features: [
        "Employment & HR Manuals",
        "Employment & Consultancy Agreements",
        "Collective Bargaining Agreements (CBAs)",
        "Employment Dispute Resolution",
      ],
    },
    {
      icon: Gavel,
      title: "Litigation",
      description:
        "Expert representation in civil, commercial, employment, and tax matters across all courts and tribunals.",
      features: [
        "Civil & Commercial Litigation",
        "Insurance Claims Defense",
        "Judicial Review Proceedings",
        "Arbitration & Tax Litigation",
      ],
    },
    {
      icon: Scale,
      title: "Non-Governmental Organizations",
      description:
        "Registration, compliance, and governance advisory for NGOs, societies, and trusts.",
      features: [
        "NGO & Society Registration",
        "Trust Formation & Management",
        "Compliance & Reporting",
        "Governance Consulting",
      ],
    },
    {
      icon: Briefcase,
      title: "Enterprise Risk Management",
      description:
        "Strategic risk management frameworks and continuous compliance monitoring for organizations.",
      features: [
        "Risk Management Framework Development",
        "Compliance Monitoring",
        "Risk Response Strategy",
        "Best Practice Implementation",
      ],
    },
  ];


  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative text-primary-foreground py-16 overflow-hidden"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Blurred image layer */}
        {/* <div className="absolute inset-0 backdrop-blur-md"></div> */}

        {/* Gradient overlay to maintain accent feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/90"></div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
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
                  <h3 className="text-2xl font-display font-semibold mb-3 text-black">
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
                <Button size="lg" variant="outline" className="hover:bg-primary/90">
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