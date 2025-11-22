import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll respond within 24 hours.",
    });
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Get in touch with our legal experts. We're here to help you navigate your legal challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: MapPin,
                title: "Visit Us",
                content: "123 Legal Plaza, Suite 500\nNew York, NY 10001",
              },
              {
                icon: Phone,
                title: "Call Us",
                content: "(212) 555-0123\n24/7 Emergency Line",
              },
              {
                icon: Mail,
                title: "Email Us",
                content: "info@premierlaw.com\nconsult@premierlaw.com",
              },
              {
                icon: Clock,
                title: "Office Hours",
                content: "Mon-Fri: 9AM - 6PM\nSat: 10AM - 2PM",
              },
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="mb-4 mx-auto p-3 bg-primary/10 rounded-full w-fit">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Fill out the form below and one of our experienced attorneys will get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={formData.subject} onValueChange={(value) => handleChange("subject", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Free Consultation</SelectItem>
                      <SelectItem value="corporate">Corporate Law</SelectItem>
                      <SelectItem value="litigation">Litigation</SelectItem>
                      <SelectItem value="family">Family Law</SelectItem>
                      <SelectItem value="estate">Estate Planning</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    required
                    rows={6}
                    className="mt-2"
                    placeholder="Tell us about your legal needs..."
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Additional Information */}
            <div className="animate-slide-up">
              <Card className="mb-6 border-accent shadow-elegant">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-display font-bold text-primary mb-4">
                    Why Choose Us?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Free initial consultation",
                      "24/7 emergency legal services",
                      "Experienced attorneys across all practice areas",
                      "Transparent communication",
                      "Competitive rates and flexible payment options",
                      "98% client satisfaction rate",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="h-2 w-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="gradient-hero text-primary-foreground">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-display font-bold mb-4">
                    Emergency Legal Services
                  </h3>
                  <p className="opacity-90 mb-6">
                    Facing an urgent legal matter? Our attorneys are available 24/7 for emergency consultations.
                  </p>
                  <Button 
                    size="lg" 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Call Now: (212) 555-0123
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-elegant bg-primary/5 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Interactive map would be integrated here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
