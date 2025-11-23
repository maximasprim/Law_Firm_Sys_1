import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Linkedin, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Attorneys = () => {
  const attorneys = [
    {
      name: "James Owino",
      title: "Managing Partner",
      specialization: "Corporate & Commercial Law",
      experience: "15+ years",
      education: "University of Nairobi, LL.B | Kenya School of Law",
      achievements: ["Advocate of the High Court of Kenya", "LSK Corporate Law Expert", "Top Legal Mind Kenya"],
      bio: "James specializes in corporate transactions, commercial disputes, and business advisory services for both local and international clients in Kenya.",
      email: "j.owino@owinokojoadvocates.com",
      phone: "+254 700 000 001",
    },
    {
      name: "Grace Kojo",
      title: "Senior Partner",
      specialization: "Family & Matrimonial Law",
      experience: "12+ years",
      education: "Moi University, LL.B | Kenya School of Law",
      achievements: ["Family Law Specialist", "LSK Member in Good Standing", "Women in Law Award"],
      bio: "Grace provides compassionate yet strategic representation in divorce, child custody, succession, and family disputes under Kenyan law.",
      email: "g.kojo@owinokojoadvocates.com",
      phone: "+254 700 000 002",
    },
    {
      name: "Peter Mwangi",
      title: "Senior Partner",
      specialization: "Litigation & Dispute Resolution",
      experience: "14+ years",
      education: "Kenyatta University, LL.B | Kenya School of Law",
      achievements: ["Trial Advocate of the Year", "High Court Litigation Expert", "LSK Excellence Award"],
      bio: "Peter has successfully litigated complex commercial, land, and civil disputes in Kenyan courts with an impressive success rate.",
      email: "p.mwangi@owinokojoadvocates.com",
      phone: "+254 700 000 003",
    },
    {
      name: "Anne Wanjiku",
      title: "Partner",
      specialization: "Employment & Labour Law",
      experience: "10+ years",
      education: "Strathmore University, LL.B | Kenya School of Law",
      achievements: ["Labour Law Expert", "Employment Rights Advocate", "Industrial Court Specialist"],
      bio: "Anne advises both employers and employees on workplace disputes, employment contracts, and compliance with Kenyan labour laws.",
      email: "a.wanjiku@owinokojoadvocates.com",
      phone: "+254 700 000 004",
    },
    {
      name: "David Kamau",
      title: "Partner",
      specialization: "Land & Property Law",
      experience: "11+ years",
      education: "University of Nairobi, LL.B | Kenya School of Law",
      achievements: ["Land Law Specialist", "Property Rights Advocate", "LSK Land Committee Member"],
      bio: "David handles complex land transactions, property disputes, conveyancing, and real estate development projects across Kenya.",
      email: "d.kamau@owinokojoadvocates.com",
      phone: "+254 700 000 005",
    },
    {
      name: "Mary Achieng",
      title: "Partner",
      specialization: "Criminal Defense & Human Rights",
      experience: "9+ years",
      education: "Catholic University of Eastern Africa, LL.B | Kenya School of Law",
      achievements: ["Human Rights Defender", "Criminal Law Expert", "Legal Aid Champion"],
      bio: "Mary provides robust defense in criminal matters and advocates for human rights protection in accordance with the Kenyan Constitution.",
      email: "m.achieng@owinokojoadvocates.com",
      phone: "+254 700 000 006",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Our Advocates
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Meet our team of experienced legal professionals dedicated to achieving exceptional results for our clients across Kenya.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10+", label: "Expert Advocates" },
              { value: "60+", label: "Years Combined Experience" },
              { value: "8+", label: "Industry Awards" },
              { value: "300+", label: "Cases Won" },
            ].map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl font-display font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attorneys Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attorneys.map((attorney, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-elegant transition-all duration-300 border-border hover:border-accent animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  {/* Avatar Placeholder */}
                  <div className="w-full aspect-square mb-4 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <div className="text-6xl font-display font-bold text-primary-foreground">
                      {attorney.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>

                  <h3 className="text-2xl font-display font-semibold text-foreground mb-1">
                    {attorney.name}
                  </h3>
                  <p className="text-accent font-semibold mb-2">{attorney.title}</p>
                  
                  <div className="space-y-2 mb-4">
                    <Badge variant="secondary" className="mr-2">
                      {attorney.specialization}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{attorney.experience} experience</p>
                    <p className="text-sm text-muted-foreground">{attorney.education}</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {attorney.bio}
                  </p>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-primary">
                      <Award className="h-4 w-4" />
                      <span>Achievements</span>
                    </div>
                    <ul className="space-y-1">
                      {attorney.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="h-1 w-1 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <a href={`mailto:${attorney.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Mail className="h-4 w-4" />
                      {attorney.email}
                    </a>
                    <a href={`tel:${attorney.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Phone className="h-4 w-4" />
                      {attorney.phone}
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn Profile
                    </a>
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
              Schedule a Consultation
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with one of our experienced advocates to discuss your legal needs.
            </p>
            <Link to="/book-consultation">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
              Book Free Consultation
            </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Attorneys;