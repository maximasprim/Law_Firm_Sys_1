import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Shield, Award, Users, ArrowRight, CheckCircle2, Star, Building2, Briefcase, FileText, Gavel } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import heroImage from "@/assets/hero-law-office.jpg";

const Home = () => {
  const services = [
    {
      icon: Building2,
      title: "Corporate Governance",
      description: "Expert guidance on corporate law, business development, and compliance with regulations.",
    },
    {
      icon: Shield,
      title: "Legal Risk Management",
      description: "Comprehensive risk audit, identification, analysis and management for organizations.",
    },
    {
      icon: Briefcase,
      title: "Commercial Law",
      description: "Banking, financing, insurance law, and property transactions with expert negotiation.",
    },
    {
      icon: Gavel,
      title: "Litigation",
      description: "Expert representation in civil, commercial suits, judicial review, and arbitral tribunals.",
    },
  ];

  const testimonials = [
    {
      name: "Michael Maxwell",
      role: "CEO, AgriMus",
      content: "Owino Kojo & Co. Advocates provided exceptional guidance during our merger. Their expertise and professionalism are unmatched.",
      rating: 5,
    },
    {
      name: "Mercy Gladwell",
      role: "Business Owner",
      content: "The team's attention to detail and strategic thinking helped us navigate complex corporate challenges successfully.",
      rating: 5,
    },
    {
      name: "Kyla Joy",
      role: "Private Client",
      content: "Compassionate, knowledgeable, and always available. They made a difficult legal matter much easier to handle.",
      rating: 5,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-amber-900/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
              Excellence in Legal Representation
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              Trusted advisors providing comprehensive legal solutions for
              individuals and businesses since 2014
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink to="/book-consultation">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/80 shadow-gold text-lg px-8"
                >
                  Free Consultation
                </Button>
              </NavLink>
              <NavLink to="/client-registration">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-gray-300 bg-transparent hover:bg-primary/10 text-lg px-8"
                >
                  Become a Client
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10+", label: "Years Experience" },
              { value: "300+", label: "Cases Won" },
              { value: "10+", label: "Expert Advocates" },
              { value: "95%", label: "Success Rate" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-black mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-black mb-4">
              Practice Areas
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive legal services tailored to your unique needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-elegant transition-all duration-300 border-border hover:border-accent animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-accent group-hover:shadow-gold transition-all duration-300">
                    <service.icon className="h-8 w-8 text-primary group-hover:text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3 text-black">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <NavLink to="/practice-areas">
              <Button size="lg" variant="outline" className="group text-black">
                View All Practice Areas
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-black mb-6">
                Why Choose Owino Kojo & Co. Advocates?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                For over a decade, we've been setting the standard for legal
                excellence. Our commitment to our clients goes beyond winning
                cases—we build lasting relationships based on trust, integrity,
                and results.
              </p>
              <div className="space-y-4">
                {[
                  "Experienced advocates with proven track records",
                  "Personalized attention to every case",
                  "Transparent communication throughout the process",
                  "24/7 emergency legal services available",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <NavLink to="/about">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Learn More About Us
                  </Button>
                </NavLink>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-elegant">
                <img
                  src={heroImage}
                  alt="Professional law office"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-3 bg-accent text-accent-foreground p-6 rounded-xl shadow-gold">
                <div className="text-3xl font-display font-bold">95%</div>
                <div className="text-sm">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-black mb-4">
              Client Testimonials
            </h2>
            <p className="text-xl text-muted-foreground">
              Don't just take our word for it—hear from our satisfied clients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="animate-slide-up hover:shadow-elegant transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-orange-500 text-orange-500"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
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
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to Discuss Your Legal Needs?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Schedule a free consultation with one of our experienced advocates
              today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink to="/contact">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/50 shadow-gold text-lg px-8"
                >
                  Get Started Today
                </Button>
              </NavLink>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground/10 text-lg px-8"
              >
                Call (254) 727 783 214
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;