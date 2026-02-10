import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Award, Users, BookOpen, UserCog, FileText } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const Advocates = () => {
  const partners = [
    {
      name: "Dr. Owino Kojo",
      title: "Managing Partner",
      specialization: "Corporate Law & Governance",
      experience: "10+ years",
      education: "LL.B (Moi University) | Postgraduate Diploma in Law (Kenya School of Law) | LL.M (University of Nairobi) | PhD Community Resources & Development (Arizona State University) | PhD in Law - In Progress (University of Nairobi)",
      achievements: [
        "Certified Corporate Secretary (KASNEB)",
        "Top Student in Commercial Law - Kenya School of Law",
        "Advocate of the High Court of Kenya",
        "Supreme Court Litigation Experience"
      ],
      bio: "Dr. Kojo specializes in commercial law, corporate governance, and complex litigation. He has argued matters in the Supreme Court, Court of Appeal, High Court, and various tribunals. He represented Madam R Enterprises in an 18 billion shilling waste management dispute.",
      email: "owinokojoadvocates@gmail.com",
      phone: "+254 727 783 214",
    },
    {
      name: "Obat Wasonga",
      title: "Partner",
      specialization: "Property Law & Commercial Litigation",
      experience: "10+ years",
      education: "LL.B | Kenya School of Law",
      achievements: [
        "Former Legal Officer - Transparency International (Kenya)",
        "Former Legal Assistant - Equity Bank",
        "Property Law Specialist",
        "Public Procurement Expert"
      ],
      bio: "Mr. Wasonga has extensive experience in property law, commercial law, insurance law, intellectual property, and litigation. He has worked with Anjarwalla & Khanna Advocates and Lumumba & Lumumba Advocates, and has argued numerous matters in the Court of Appeal, High Court, and Environment & Land Court.",
      email: "owinokojoadvocates@gmail.com",
      phone: "+254 727 783 214",
    },
  ];

  const associates = [
    {
      name: "Wanjala Wekesa",
      title: "Associate",
      specialization: "General Practice",
      education: "LL.B | Kenya School of Law",
      bio: "Wanjala Wekesa is an experienced associate handling various legal matters including litigation, corporate documentation, and legal research across multiple practice areas.",
    },
    {
      name: "Kevin Njoroge",
      title: "Associate",
      specialization: "General Practice",
      education: "LL.B | Kenya School of Law",
      bio: "Kevin Njoroge provides comprehensive legal services across various practice areas, with a focus on commercial law and client advisory services.",
    },
  ];

  const researchers = [
    {
      name: "Kassim Shabban",
      title: "Researcher",
      specialization: "Legal Research",
    },
    {
      name: "Roselyn Musyoka",
      title: "Researcher",
      specialization: "Legal Research",
    },
  ];

  const consultants = [
    {
      name: "CPA. FA. Charles Okeyo Owuor",
      title: "Consultant",
      specialization: "Financial Advisory",
      phone: "+254 722 124 171",
    },
    {
      name: "Dr. Loise Musikali",
      title: "Consultant",
      specialization: "Academic Consultant",
      organization: "Daystar University",
      email: "lmusikali@gmail.com",
    },
    {
      name: "Dr. Seth Wekesa",
      title: "Consultant",
      specialization: "Academic Consultant",
      organization: "University of Nairobi",
      email: "wekesas@uonbi.ac.ke",
    },
    {
      name: "Fred Ngatia, SC",
      title: "Consultant",
      specialization: "Senior Counsel",
      organization: "Ngatia & Associates Advocates, Nairobi",
      email: "info@ngatiaassociates.co.ke",
    },
    {
      name: "Joseph Buwembo",
      title: "Consultant",
      specialization: "International Consultant",
      organization: "Kampala, Uganda",
    },
  ];

  const administrator = {
    name: "Mercy Khatikiyi",
    title: "Administrator",
    specialization: "Firm Administration",
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Our Team
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Meet our team of experienced legal professionals, researchers, and consultants dedicated to achieving exceptional results for our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "2", label: "Partners" },
              { value: "10+", label: "Years Experience" },
              { value: "5", label: "Expert Consultants" },
              { value: "KSh 1B", label: "Indemnity Cover" },
            ].map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl font-display font-bold text-black mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              Partners
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {partners.map((advocate, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-elegant transition-all duration-300 border-border hover:border-accent animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-full aspect-square mb-4 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <div className="text-6xl font-display font-bold text-primary-foreground">
                      {advocate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>

                  <h3 className="text-2xl font-display font-semibold text-foreground mb-1">
                    {advocate.name}
                  </h3>
                  <p className="text-accent font-semibold mb-2">{advocate.title}</p>
                  
                  <div className="space-y-2 mb-4">
                    <Badge variant="secondary" className="mr-2">
                      {advocate.specialization}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{advocate.experience} experience</p>
                    <p className="text-sm text-muted-foreground">{advocate.education}</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {advocate.bio}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-primary">
                      <Award className="h-4 w-4" />
                      <span>Achievements</span>
                    </div>
                    <ul className="space-y-1">
                      {advocate.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="h-1 w-1 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <a href={`mailto:${advocate.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Mail className="h-4 w-4" />
                      {advocate.email}
                    </a>
                    <a href={`tel:${advocate.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Phone className="h-4 w-4" />
                      {advocate.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Associates Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-display font-bold text-primary mb-4">
              Associates
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {associates.map((associate, index) => (
              <Card 
                key={index} 
                className="hover:shadow-elegant transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                      <div className="text-2xl font-display font-bold text-primary-foreground">
                        {associate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-semibold text-foreground">
                        {associate.name}
                      </h3>
                      <p className="text-accent text-sm font-semibold">{associate.title}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mb-3">
                    {associate.specialization}
                  </Badge>
                  <p className="text-sm text-muted-foreground mb-3">{associate.education}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{associate.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Researchers & Administrator Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Researchers */}
            <div>
              <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-display font-bold text-primary mb-2">
                  Researchers
                </h2>
              </div>
              <div className="space-y-4">
                {researchers.map((researcher, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground">{researcher.name}</h3>
                      <p className="text-sm text-muted-foreground">{researcher.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Administrator */}
            <div className="flex flex-col items-center ">
              <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <UserCog className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-display font-bold text-primary mb-2">
                  Administrator
                </h2>
              </div>
              {/* <div className="flex items-center justify-center"> */}
              <Card className="hover:shadow-lg transition-all duration-300 w-full mt-4">
                <CardContent className="p-6 ">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                      <div className="text-xl font-display font-bold text-primary-foreground">
                        {administrator.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{administrator.name}</h3>
                      <p className="text-sm text-accent font-semibold">{administrator.title}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{administrator.specialization}</p>
                </CardContent>
              </Card>
              {/* </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Consultants Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-4xl font-display font-bold text-primary mb-4">
              Consultants
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our expert panel of consultants brings specialized knowledge across finance, academia, and legal practice.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {consultants.map((consultant, index) => (
              <Card 
                key={index} 
                className="hover:shadow-elegant transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-display font-semibold text-foreground mb-1">
                      {consultant.name}
                    </h3>
                    <p className="text-accent text-sm font-semibold mb-2">{consultant.title}</p>
                    <Badge variant="secondary" className="text-xs">
                      {consultant.specialization}
                    </Badge>
                  </div>
                  {consultant.organization && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {consultant.organization}
                    </p>
                  )}
                  <div className="space-y-2">
                    {consultant.email && (
                      <a href={`mailto:${consultant.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-3 w-3" />
                        {consultant.email}
                      </a>
                    )}
                    {consultant.phone && (
                      <a href={`tel:${consultant.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <Phone className="h-3 w-3" />
                        {consultant.phone}
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Staff Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl font-display font-bold text-primary mb-4">
                Support Team
              </h2>
              <p className="text-muted-foreground">
                Our dedicated support staff ensuring seamless service delivery
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Clerks/Assistants */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Clerks & Assistants
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Brian Fredrick Otieno",
                      "Kendi Linda Kiara",
                      "Fredrick Athero",
                      "Bridon Omondi",
                      "Stephen Misoire"
                    ].map((name, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {name}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Process Servers */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    Process Servers
                  </h3>
                  <ul className="space-y-2">
                    {[
                      { name: "Brian Fredrick Otieno", location: "Nairobi" },
                      { name: "Brazhnev .O. Ang'wech", location: "Nairobi" },
                      { name: "James K'okudo", location: "Kisumu" },
                      { name: "Cosmas Laja", location: "Kisumu" },
                      { name: "Dennis Malova", location: "Bungoma" }
                    ].map((server, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {server.name} <span className="text-xs">({server.location})</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
              Schedule a Consultation
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with our experienced team to discuss your legal needs.
            </p>
            <NavLink to="/book-consultation">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
                Book Free Consultation
              </Button>
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Advocates;