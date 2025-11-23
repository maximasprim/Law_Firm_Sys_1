import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "CEO, TechCorp",
      company: "Technology",
      rating: 5,
      content: "Owino Kojo Advocates provided exceptional guidance during our $50M merger. Their expertise in corporate law and attention to detail ensured a smooth transaction. Michael Harrison and his team were responsive, knowledgeable, and truly understood our business needs.",
      category: "Corporate Law",
      year: "2024",
    },
    {
      name: "Robert Chen",
      role: "Business Owner",
      company: "Manufacturing",
      rating: 5,
      content: "After facing a complex commercial dispute that threatened my business, Sarah Chen's litigation team delivered an outstanding result. Their strategic thinking and courtroom expertise resulted in a favorable settlement that exceeded our expectations.",
      category: "Litigation",
      year: "2024",
    },
    {
      name: "Jennifer Adams",
      role: "Private Client",
      company: "Personal",
      rating: 5,
      content: "During the most difficult time of my life - my divorce - Emily Thompson provided not just legal expertise but genuine compassion and support. She fought tirelessly for my children's best interests and achieved a custody arrangement that works perfectly for our family.",
      category: "Family Law",
      year: "2024",
    },
    {
      name: "David Sullivan",
      role: "Real Estate Developer",
      company: "Real Estate",
      rating: 5,
      content: "Robert Williams handled the legal aspects of our $45M commercial development project flawlessly. His knowledge of zoning laws and real estate transactions was instrumental in navigating complex regulatory requirements.",
      category: "Real Estate",
      year: "2023",
    },
    {
      name: "Maria Garcia",
      role: "Accident Victim",
      company: "Personal",
      rating: 5,
      content: "After my car accident, I was overwhelmed and didn't know where to turn. Premier Law fought for me and secured a $2.8M settlement that covers my medical expenses and lost wages. They truly cared about my recovery and future.",
      category: "Personal Injury",
      year: "2023",
    },
    {
      name: "Thomas Anderson",
      role: "Entrepreneur",
      company: "Technology",
      rating: 5,
      content: "David Martinez's intellectual property expertise was crucial in protecting our patents and trademarks. His proactive approach prevented potential infringement issues and gave us peace of mind as we scaled our startup.",
      category: "IP Law",
      year: "2023",
    },
    {
      name: "Linda Patterson",
      role: "Executive",
      company: "Finance",
      rating: 5,
      content: "Jennifer Kim represented me in a wrongful termination case against my former employer. Her professionalism, knowledge of employment law, and negotiation skills resulted in a substantial settlement that compensated me fairly.",
      category: "Employment Law",
      year: "2023",
    },
    {
      name: "James Wilson",
      role: "Retiree",
      company: "Personal",
      rating: 5,
      content: "Creating a comprehensive estate plan was something I had been putting off for years. The team made the process simple and stress-free. Now I have peace of mind knowing my family will be taken care of according to my wishes.",
      category: "Estate Planning",
      year: "2024",
    },
    {
      name: "Patricia Brown",
      role: "Small Business Owner",
      company: "Retail",
      rating: 5,
      content: "When my business partner and I had a falling out, the situation could have destroyed everything we built. Premier Law's mediation and business law expertise helped us reach an amicable resolution that preserved the business.",
      category: "Corporate Law",
      year: "2023",
    },
  ];

  const platformRatings = [
    { platform: "Google Reviews", rating: "4.9", reviews: "450+ reviews" },
    { platform: "Avvo", rating: "5.0", reviews: "200+ reviews" },
    { platform: "Martindale-Hubbell", rating: "AV", reviews: "Preeminent Rated" },
    { platform: "Super Lawyers", rating: "Top", reviews: "10 Years" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 fill-accent text-accent" />
              ))}
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Client Testimonials
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Read what our clients say about their experience working with Owino Kojo Advocates
            </p>
          </div>
        </div>
      </section>

      {/* Platform Ratings */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platformRatings.map((item, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl font-display font-bold text-primary mb-1">
                  {item.rating}
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">{item.platform}</div>
                <div className="text-xs text-muted-foreground">{item.reviews}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-elegant transition-all duration-300 border-border hover:border-accent animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <Quote className="h-10 w-10 text-accent/20 mb-4" />
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>

                  <div className="border-t border-border pt-4">
                    <div className="font-semibold text-foreground mb-1">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {testimonial.role} • {testimonial.company}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{testimonial.year}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-primary mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-muted-foreground">
              Our clients' satisfaction speaks for itself
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "98%", label: "Client Satisfaction" },
              { value: "95%", label: "Cases Won" },
              { value: "5,000+", label: "Happy Clients" },
              { value: "4.9/5", label: "Average Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Experience the Difference
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of satisfied clients. Schedule your free consultation today.
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

export default Testimonials;
