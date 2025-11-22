import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Target, Heart, TrendingUp, Globe } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import aboutImage from "@/assets/about-justice.jpg";

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards of legal practice and consistently deliver exceptional results.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Our commitment to ethical practice and transparency guides every decision we make.",
    },
    {
      icon: Users,
      title: "Client-Focused",
      description: "Your success is our priority. We provide personalized attention and tailored strategies.",
    },
    {
      icon: Target,
      title: "Results-Driven",
      description: "We combine legal expertise with strategic thinking to achieve your desired outcomes.",
    },
  ];

  const milestones = [
    { year: "1985", event: "Premier Law Associates founded in New York City" },
    { year: "1992", event: "Expanded to handle major corporate litigation" },
    { year: "2000", event: "Opened offices in multiple states" },
    { year: "2008", event: "Achieved landmark $50M settlement in class action case" },
    { year: "2015", event: "Named Top Law Firm by multiple publications" },
    { year: "2020", event: "Surpassed 5,000 cases won" },
    { year: "2025", event: "Celebrating 40 years of excellence" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              About Premier Law Associates
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Four decades of legal excellence, trusted relationships, and unwavering commitment to justice.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 1985, Premier Law Associates began with a simple mission: to provide exceptional legal representation with integrity and dedication. What started as a small practice in New York City has grown into a leading multi-practice law firm serving clients across the nation.
                </p>
                <p>
                  For nearly four decades, we've built our reputation on a foundation of legal excellence, ethical practice, and unwavering commitment to our clients. Our team of experienced attorneys brings together diverse expertise across multiple practice areas, allowing us to serve individuals, businesses, and organizations with comprehensive legal solutions.
                </p>
                <p>
                  Today, with over 50 attorneys and a support staff dedicated to excellence, we continue to set the standard for legal representation. Our success is measured not just in cases won, but in the lasting relationships we build and the positive impact we make in our clients' lives.
                </p>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="aspect-video rounded-2xl overflow-hidden shadow-elegant">
                <img 
                  src={aboutImage} 
                  alt="Justice and law concept" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-elegant transition-all duration-300 border-border hover:border-accent animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 mx-auto p-4 bg-primary/10 rounded-full w-fit hover:bg-accent hover:shadow-gold transition-all duration-300 group">
                    <value.icon className="h-10 w-10 text-primary group-hover:text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3 text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              Key milestones in our 40-year history
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className="flex gap-6 items-start animate-slide-up group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="text-2xl font-display font-bold text-accent group-hover:text-primary transition-colors">
                      {milestone.year}
                    </span>
                  </div>
                  <div className="flex-shrink-0 mt-2">
                    <div className="h-3 w-3 rounded-full bg-accent group-hover:bg-primary group-hover:shadow-gold transition-all duration-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground leading-relaxed group-hover:text-primary transition-colors">
                      {milestone.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { icon: TrendingUp, value: "98%", label: "Success Rate" },
              { icon: Users, value: "50+", label: "Attorneys" },
              { icon: Award, value: "100+", label: "Awards" },
              { icon: Globe, value: "10+", label: "States" },
            ].map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <stat.icon className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <div className="text-4xl md:text-5xl font-display font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
              Ready to Work With Us?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Experience the Premier Law difference. Schedule your free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink to="/contact">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
                  Get Started
                </Button>
              </NavLink>
              <NavLink to="/attorneys">
                <Button size="lg" variant="outline">
                  Meet Our Team
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
