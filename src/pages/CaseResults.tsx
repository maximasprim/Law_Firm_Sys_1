import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Award, DollarSign } from "lucide-react";
import { useState } from "react";

const CaseResults = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Corporate", "Litigation", "Personal Injury", "Real Estate", "Family Law", "Employment"];

  const caseResults = [
    {
      title: "$50 Million Class Action Settlement",
      category: "Litigation",
      description: "Successfully represented 10,000+ consumers in a securities fraud class action lawsuit against a Fortune 500 company.",
      outcome: "Settlement",
      amount: "$50M",
      year: "2024",
      highlight: true,
    },
    {
      title: "Landmark Corporate Merger Approval",
      category: "Corporate",
      description: "Advised on a $2.3 billion cross-border merger, navigating complex regulatory requirements across three jurisdictions.",
      outcome: "Approved",
      amount: "$2.3B",
      year: "2024",
    },
    {
      title: "Medical Malpractice Jury Verdict",
      category: "Personal Injury",
      description: "Secured jury verdict for client who suffered permanent injuries due to surgical negligence.",
      outcome: "Verdict",
      amount: "$12M",
      year: "2024",
    },
    {
      title: "Commercial Real Estate Dispute Resolution",
      category: "Real Estate",
      description: "Won arbitration for developer in $8M construction defect dispute, recovering full damages plus costs.",
      outcome: "Arbitration Win",
      amount: "$8M",
      year: "2024",
    },
    {
      title: "Executive Wrongful Termination",
      category: "Employment",
      description: "Obtained substantial settlement for C-suite executive wrongfully terminated and denied severance package.",
      outcome: "Settlement",
      amount: "$5.2M",
      year: "2023",
    },
    {
      title: "Patent Infringement Defense Victory",
      category: "Litigation",
      description: "Successfully defended technology company against patent troll, resulting in dismissal with prejudice.",
      outcome: "Dismissal",
      amount: "Defense",
      year: "2023",
    },
    {
      title: "Complex Custody Battle Victory",
      category: "Family Law",
      description: "Secured primary custody for client in high-net-worth divorce involving international custody dispute.",
      outcome: "Custody Granted",
      amount: "Victory",
      year: "2023",
    },
    {
      title: "Securities Litigation Defense",
      category: "Corporate",
      description: "Defended hedge fund in SEC investigation, achieving no-penalty resolution.",
      outcome: "No Penalties",
      amount: "Resolved",
      year: "2023",
    },
    {
      title: "Product Liability Settlement",
      category: "Personal Injury",
      description: "Negotiated settlement for multiple clients injured by defective consumer product.",
      outcome: "Settlement",
      amount: "$4.8M",
      year: "2023",
    },
  ];

  const filteredResults = selectedCategory === "All" 
    ? caseResults 
    : caseResults.filter(result => result.category === selectedCategory);

  const stats = [
    { icon: Trophy, value: "$500M+", label: "Total Recovered" },
    { icon: TrendingUp, value: "98%", label: "Success Rate" },
    { icon: Award, value: "5,000+", label: "Cases Won" },
    { icon: DollarSign, value: "$50M", label: "Largest Settlement" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Case Results & Victories
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              A proven track record of success achieving exceptional outcomes for our clients
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
              <strong>Important:</strong> Past results do not guarantee future outcomes. Every case is unique and results depend on individual circumstances. These case results are provided for informational purposes only.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-background sticky top-20 z-40 border-b border-border">
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

                  <div className="border-t border-border pt-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Outcome</div>
                      <div className="font-semibold text-foreground">{result.outcome}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">Result</div>
                      <div className="text-2xl font-display font-bold text-accent">
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

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Let Us Fight For You
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Our proven track record speaks for itself. Schedule a free consultation to discuss your case.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold px-8 py-3 rounded-md font-semibold">
                Free Consultation
              </button>
              <button className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8 py-3 rounded-md font-semibold">
                Call (212) 555-0123
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseResults;
