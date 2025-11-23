import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Award, DollarSign } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const CaseResults = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Corporate", "Litigation", "Land & Property", "Family Law", "Employment", "Criminal Defense"];

  const caseResults = [
    {
      title: "KSh 45M Commercial Dispute Victory",
      category: "Litigation",
      description: "Successfully represented client in a complex commercial contract dispute at the High Court of Kenya, securing full compensation plus costs.",
      outcome: "Judgment Granted",
      amount: "KSh 45M",
      year: "2024",
      highlight: true,
    },
    {
      title: "Major Corporate Merger Advisory",
      category: "Corporate",
      description: "Advised on a KSh 800M merger between two leading Kenyan companies, ensuring compliance with Competition Authority of Kenya regulations.",
      outcome: "Approved",
      amount: "KSh 800M",
      year: "2024",
    },
    {
      title: "Land Title Dispute Resolution",
      category: "Land & Property",
      description: "Won landmark case restoring rightful ownership of prime Nairobi property worth KSh 120M to our client after decade-long dispute.",
      outcome: "Title Restored",
      amount: "KSh 120M",
      year: "2024",
    },
    {
      title: "Employment Tribunal Success",
      category: "Employment",
      description: "Secured KSh 8.5M compensation for client in wrongful dismissal case at the Employment and Labour Relations Court.",
      outcome: "Compensation Awarded",
      amount: "KSh 8.5M",
      year: "2024",
    },
    {
      title: "High-Profile Criminal Acquittal",
      category: "Criminal Defense",
      description: "Successfully defended client in complex fraud case, resulting in full acquittal after comprehensive evidence presentation.",
      outcome: "Acquitted",
      amount: "Victory",
      year: "2024",
    },
    {
      title: "Matrimonial Property Settlement",
      category: "Family Law",
      description: "Negotiated favorable settlement in high-net-worth divorce, securing KSh 35M in assets and property for our client.",
      outcome: "Settlement Reached",
      amount: "KSh 35M",
      year: "2023",
    },
    {
      title: "Succession Dispute Victory",
      category: "Family Law",
      description: "Won succession case securing our client's rightful inheritance of family estate valued at KSh 25M.",
      outcome: "Inheritance Secured",
      amount: "KSh 25M",
      year: "2023",
    },
    {
      title: "Real Estate Development Deal",
      category: "Land & Property",
      description: "Facilitated acquisition and conveyancing of KSh 200M mixed-use development property in Westlands, Nairobi.",
      outcome: "Transaction Completed",
      amount: "KSh 200M",
      year: "2023",
    },
    {
      title: "Corporate Tax Dispute Resolution",
      category: "Corporate",
      description: "Successfully represented company in KRA tax dispute, reducing assessed tax liability by KSh 18M through negotiation.",
      outcome: "Liability Reduced",
      amount: "KSh 18M",
      year: "2023",
    },
    {
      title: "Employment Discrimination Case",
      category: "Employment",
      description: "Won discrimination case at Employment Court, securing compensation and reinstatement for wrongfully terminated employee.",
      outcome: "Reinstated + Compensation",
      amount: "KSh 4.2M",
      year: "2023",
    },
    {
      title: "Land Acquisition Appeal Success",
      category: "Land & Property",
      description: "Successfully appealed government land acquisition valuation, securing additional KSh 12M compensation for client.",
      outcome: "Appeal Allowed",
      amount: "KSh 12M",
      year: "2022",
    },
    {
      title: "Business Partnership Dissolution",
      category: "Corporate",
      description: "Negotiated amicable dissolution of business partnership, protecting client's interests worth KSh 30M.",
      outcome: "Settlement Reached",
      amount: "KSh 30M",
      year: "2022",
    },
  ];

  const filteredResults = selectedCategory === "All" 
    ? caseResults 
    : caseResults.filter(result => result.category === selectedCategory);

  const stats = [
    { icon: Trophy, value: "KSh 500M+", label: "Total Value Recovered" },
    { icon: TrendingUp, value: "95%", label: "Success Rate" },
    { icon: Award, value: "300+", label: "Cases Won" },
    { icon: DollarSign, value: "KSh 120M", label: "Largest Property Case" },
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
              A proven track record of success achieving exceptional outcomes for our clients across Kenya
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
              <Link to="/book-consultation">
              <button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold px-8 py-3 rounded-md font-semibold">
                Free Consultation
              </button>
              </Link>
              <button className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8 py-3 rounded-md font-semibold">
                Call +254 727 783 214
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseResults;