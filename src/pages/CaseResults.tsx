import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Award, Building } from "lucide-react";
import { useState } from "react";
import { NavLink } from "@/components/NavLink";

const CaseResults = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Corporate Governance", "Litigation", "Property Law", "Judicial Review", "Public Procurement"];

  const caseResults = [
    {
      title: "KSh 18B Waste Management Constitutional Petition",
      category: "Litigation",
      description: "Represented Madam R Enterprises in a landmark constitutional petition regarding a disputed waste management contract at the High Court in Kisumu.",
      outcome: "High Court Constitutional Petition No. 1 of 2014",
      amount: "KSh 18B",
      year: "2014",
      highlight: true,
      reference: "Kisumu High Court Constitutional Petition No. 1 of 2014"
    },
    {
      title: "2017 General Election - MP Nomination Dispute",
      category: "Litigation",
      description: "Successfully argued an election petition in the Supreme Court of Kenya arising from a disputed nomination and election process for Muhoroni Constituency Member of Parliament.",
      outcome: "Supreme Court Litigation",
      amount: "Victory",
      year: "2017",
      highlight: true,
    },
    {
      title: "Runda Estate Northern By-Pass Case",
      category: "Property Law",
      description: "Participated in and advised Cycads Properties Limited and other residents of Runda Estate in a high-profile constitutional petition against compulsory land acquisition for the Northern By-Pass construction.",
      outcome: "Constitutional Petition",
      amount: "Advisory",
      year: "Recent",
    },
    {
      title: "Africa Oil Limited - Turkana Oil Prospecting License",
      category: "Judicial Review",
      description: "Advised Africa Oil Limited in a Judicial Review application seeking an order of certiorari to quash the Minister of Energy's decision that failed to grant an oil prospecting license in Turkana.",
      outcome: "Application Dismissed",
      amount: "Advisory",
      year: "Recent",
    },
    {
      title: "Ravassam Properties Limited - Kilimani Property Dispute",
      category: "Property Law",
      description: "Advised Ravassam Properties Limited in a complex property dispute concerning prime property in the Kilimani area of Nairobi.",
      outcome: "Advisory",
      amount: "Prime Property",
      year: "Recent",
    },
    {
      title: "Capital Markets Authority vs Cooper Motors (CMC)",
      category: "Corporate Governance",
      description: "Advised the Capital Markets Authority (CMA) in a dispute against Cooper Motors Limited (CMC) regarding suspension from the Capital Markets and allegations of corporate governance malpractices.",
      outcome: "Advisory",
      amount: "Advisory",
      year: "Recent",
    },
    {
      title: "Illegal Land Transfer Board Resolution Case",
      category: "Property Law",
      description: "Advised a client in a land dispute where the Plaintiff accused the client of illegally transferring land without the requisite Company board of directors' approval.",
      outcome: "Defense",
      amount: "Advisory",
      year: "Recent",
    },
    {
      title: "Nairobi Stock Exchange Listed Company Acquisition",
      category: "Corporate Governance",
      description: "Carried out comprehensive legal due diligence for a client acquiring a substantial stake in a company listed on the Nairobi Stock Exchange.",
      outcome: "Due Diligence Completed",
      amount: "Substantial Stake",
      year: "Recent",
    },
    {
      title: "Aero-Century Corporation Aircraft Lease Dispute",
      category: "Litigation",
      description: "Advised California-based Aero-Century Corporation Limited, an aircraft leasing and financing company, in a claim for a disputed oral agreement for lease renewal filed by DAC Aviation Ltd (Canada).",
      outcome: "International Advisory",
      amount: "Aircraft Lease",
      year: "Recent",
    },
    {
      title: "Agility Logistics Trademark Infringement",
      category: "Intellectual Property",
      description: "Provided intellectual property advice to Logistics Limited in a High Court application against a third party for infringement of the trade name 'agility logistics'.",
      outcome: "IP Protection",
      amount: "Advisory",
      year: "Recent",
    },
    {
      title: "Public Procurement Cases Digest",
      category: "Public Procurement",
      description: "Assisted in compiling a comprehensive digest for public procurement cases, demonstrating expertise in public procurement law and administrative review.",
      outcome: "Research & Compilation",
      amount: "Advisory",
      year: "Recent",
    },
  ];

  const filteredResults = selectedCategory === "All" 
    ? caseResults 
    : caseResults.filter(result => result.category === selectedCategory);

  const stats = [
    { icon: Trophy, value: "KSh 18B", label: "Largest Single Case" },
    { icon: Building, value: "Supreme Court", label: "Highest Court Argued" },
    { icon: Award, value: "50+", label: "High-Profile Cases" },
    { icon: TrendingUp, value: "10+", label: "Years Experience" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Notable Cases & Matters
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              A proven track record of handling high-profile cases across Kenya's courts and tribunals
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-fit">
                  <stat.icon className="h-8 w-8 text-accent" />
                </div>
                <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground italic">
              <strong>Important:</strong> Past results do not guarantee future outcomes. Every case is unique and results depend on individual circumstances. These case summaries are provided for informational purposes only.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-4 bg-amber-100 sticky top-20 z-40 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 text-sm ${
                  selectedCategory === category
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "hover:bg-muted"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Case Results Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResults.map((result, index) => (
              <Card
                key={index}
                className={`group hover:shadow-elegant transition-all duration-300 animate-slide-up ${
                  result.highlight ? "border-accent border-2" : "border-border hover:border-accent"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  {result.highlight && (
                    <Badge className="mb-4 bg-accent text-accent-foreground">
                      Featured Case
                    </Badge>
                  )}
                  
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary">
                      {result.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{result.year}</span>
                  </div>

                  <h3 className="text-xl font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {result.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {result.description}
                  </p>

                  {result.reference && (
                    <p className="text-xs text-muted-foreground italic mb-4">
                      {result.reference}
                    </p>
                  )}

                  <div className="border-t border-border pt-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Type</div>
                      <div className="font-semibold text-foreground text-sm">{result.outcome}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Value/Scope</div>
                      <div className="text-lg font-display font-bold text-accent">
                        {result.amount}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Notable Clients Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-primary mb-4">
              Notable Clients
            </h2>
            <p className="text-muted-foreground">
              Trusted by government agencies, international organizations, and leading corporations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-2">Government Agencies</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Capital Markets Authority (CMA)</li>
                  <li>• National Land Commission (NLC)</li>
                  <li>• Kenya Power & Lighting Company</li>
                  <li>• Independent Electoral & Boundaries Commission</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-2">International</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Aero-Century Corporation (USA)</li>
                  <li>• Media Legal Defence Initiative (UK)</li>
                  <li>• Agency of Commerce & Development (Canada)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-2">Corporate Clients</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Nzoia Sugar Company</li>
                  <li>• Kenya Power Pension Fund</li>
                  <li>• Geminia Insurance Company</li>
                  <li>• Multiple Listed Companies</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Let Us Handle Your Legal Matter
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Our proven track record speaks for itself. Schedule a free consultation to discuss your case.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink to="/book-consultation">
                <button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold px-8 py-3 rounded-md font-semibold">
                  Free Consultation
                </button>
              </NavLink>
              <a href="tel:+254727783214">
                <button className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8 py-3 rounded-md font-semibold">
                  Call +254 727 783 214
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseResults;