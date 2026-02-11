import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Target, Heart, TrendingUp, Globe, Shield, CheckCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import aboutImage from "@/assets/about-justice.jpg";
import bg from '@/assets/act-vs-law.jpg';


const About = () => {
  const values = [
    {
      icon: Award,
      title: "Professionalism",
      description: "We maintain the highest standards of legal practice with qualified and experienced advocates.",
    },
    {
      icon: CheckCircle,
      title: "Responsiveness",
      description: "Quick and effective response to client needs, ensuring timely legal solutions.",
    },
    {
      icon: Heart,
      title: "Accountability",
      description: "Taking full responsibility for our work and maintaining transparency with our clients.",
    },
    {
      icon: Users,
      title: "Accessibility",
      description: "Making quality legal services available and approachable for all our clients.",
    },
    {
      icon: Target,
      title: "Versatility",
      description: "Comprehensive legal expertise across multiple practice areas to serve diverse client needs.",
    },
  ];

  const milestones = [
    { year: "2014", event: "Owino Kojo & Co. Advocates registered on 24th July 2014" },
    { year: "2014", event: "Offices established in Nairobi and Kisumu with KSh 1 Billion indemnity cover" },
    { year: "2015-2017", event: "Built reputation in commercial law, corporate governance, and risk management" },
    { year: "2018", event: "Kisumu office closed as partner pursued ventures abroad" },
    { year: "2014-Present", event: "Handled high-profile cases including KSh 18 Billion waste management dispute" },
    { year: "Present", event: "Aspiring to be leading law firm in East and Central Africa" },
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
              About Owino Kojo & Co. Advocates
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              A decade of legal excellence, trusted relationships, and unwavering commitment to justice in Kenya and beyond.
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
                  Founded on 24th July 2014, Owino Kojo & Co. Advocates was established with a clear mission: to provide strategic and satisfactory cost-effective legal services to clients. What began with offices in both Nairobi and Kisumu has evolved into a top-tier law firm with a strong presence in Kenya's capital.
                </p>
                <p>
                  Our firm specializes in Commercial Law, Corporate Governance, Conveyancing, Intellectual Property, Legal Audit, Human Resource Law, Non-Governmental Organizations, Litigation, and Enterprise Risk Management. With an indemnity cover of One Billion Kenya Shillings, we demonstrate our commitment to protecting our clients' interests.
                </p>
                <p>
                  Led by Dr. Owino Kojo, a Certified Corporate Secretary with advanced degrees including a PhD, our team of astute, able, qualified and experienced partners and associates has handled some of Kenya's most significant legal matters, including an 18 billion shilling waste management dispute. We work closely with our clients to assess legal risks and find appropriate legal solutions that promote their business objectives.
                </p>
                <p>
                  Today, operating from Lower Hill Duplex in Upper Hill, Nairobi, we continue to aspire towards becoming the leading law firm in East and Central Africa, setting the standard for legal excellence in the region.
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
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-gold">
                <div className="text-3xl font-display font-bold">KSh 1B</div>
                <div className="text-sm">Indemnity Cover</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-elegant transition-all duration-300 border-2 border-accent/20">
              <CardContent className="p-8">
                <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                  <Target className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold text-primary mb-4">
                  Our Vision
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To be a leading law firm in East and Central Africa and beyond.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-elegant transition-all duration-300 border-2 border-accent/20">
              <CardContent className="p-8">
                <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold text-primary mb-4">
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To provide strategic and satisfactory cost effective legal services to clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              Key milestones since our establishment in 2014
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
                  <div className="flex-shrink-0 w-32 text-right">
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
              { icon: TrendingUp, value: "10+", label: "Years Experience" },
              { icon: Users, value: "2", label: "Partners" },
              { icon: Award, value: "50+", label: "High-Profile Cases" },
              { icon: Globe, value: "East Africa", label: "Regional Reach" },
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
              Experience the Owino Kojo & Co. Advocates difference. Schedule your free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink to="/contact">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
                  Get Started
                </Button>
              </NavLink>
              <NavLink to="/advocates">
                <Button size="lg" variant="outline" className="hover:bg-primary/90">
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