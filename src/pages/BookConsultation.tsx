import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, CheckCircle2, Phone, Video, MapPin } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const BookConsultation = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    practiceArea: "",
    consultationType: "",
    timeSlot: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create email body with form data
    const emailBody = `
New Consultation Request from ${formData.firstName} ${formData.lastName}

Contact Information:
- Email: ${formData.email}
- Phone: ${formData.phone}

Consultation Details:
- Practice Area: ${formData.practiceArea}
- Type: ${formData.consultationType}
- Preferred Date: ${date ? format(date, "PPP") : "Not specified"}
- Preferred Time: ${formData.timeSlot}

Message:
${formData.message}
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:owinokojoadvocates@gmail.com?subject=Consultation Request - ${formData.firstName} ${formData.lastName}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening Email Client",
      description: "Please send the email to complete your consultation request.",
    });
  };

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const consultationTypes = [
    { value: "in-person", label: "In-Person", icon: MapPin },
    { value: "phone", label: "Phone Call", icon: Phone },
    { value: "video", label: "Video Conference", icon: Video },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Book Your Free Consultation
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Schedule a complimentary consultation with one of our experienced advocates. No obligations, just expert legal guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: CheckCircle2, title: "100% Free", description: "No cost, no obligations" },
              { icon: Clock, title: "30-60 Minutes", description: "Comprehensive case review" },
              { icon: Phone, title: "Multiple Options", description: "In-person, phone, or video" },
            ].map((item, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="mx-auto mb-4 p-3 bg-accent/10 rounded-full w-fit">
                  <item.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Card className="border-accent shadow-elegant">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-2xl font-display font-bold text-primary mb-6">
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleChange("firstName", e.target.value)}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleChange("lastName", e.target.value)}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
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
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+254..."
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          required
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Consultation Details */}
                  <div>
                    <h3 className="text-2xl font-display font-bold text-primary mb-6">
                      Consultation Details
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <Label>Practice Area *</Label>
                        <Select value={formData.practiceArea} onValueChange={(value) => handleChange("practiceArea", value)}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select practice area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="legal-risk-management">Legal Risk Audit & Management</SelectItem>
                            <SelectItem value="corporate-governance">Corporate Governance</SelectItem>
                            <SelectItem value="commercial-law">Commercial Law</SelectItem>
                            <SelectItem value="banking-finance">Banking & Financing Law</SelectItem>
                            <SelectItem value="insurance">Insurance Law</SelectItem>
                            <SelectItem value="property-law">Property Law & Conveyancing</SelectItem>
                            <SelectItem value="debt-recovery">Recoveries & Debt Management</SelectItem>
                            <SelectItem value="it-law">Information Technology Law</SelectItem>
                            <SelectItem value="intellectual-property">Intellectual Property Law</SelectItem>
                            <SelectItem value="human-resource">Human Resource Law</SelectItem>
                            <SelectItem value="litigation">Litigation</SelectItem>
                            <SelectItem value="ngo">Non-Governmental Organizations</SelectItem>
                            <SelectItem value="enterprise-risk">Enterprise Risk Management</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Consultation Type *</Label>
                        <div className="grid md:grid-cols-3 gap-4 mt-2">
                          {consultationTypes.map((type) => (
                            <Card
                              key={type.value}
                              className={cn(
                                "cursor-pointer transition-all duration-300",
                                formData.consultationType === type.value
                                  ? "border-accent border-2 shadow-gold"
                                  : "border-border hover:border-accent"
                              )}
                              onClick={() => handleChange("consultationType", type.value)}
                            >
                              <CardContent className="p-4 text-center">
                                <type.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                                <div className="font-semibold text-sm">{type.label}</div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label>Preferred Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal mt-2",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div>
                          <Label>Preferred Time *</Label>
                          <Select value={formData.timeSlot} onValueChange={(value) => handleChange("timeSlot", value)}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select time slot" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="message">Brief Description of Your Legal Matter</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleChange("message", e.target.value)}
                          rows={4}
                          className="mt-2"
                          placeholder="Please provide a brief overview of your legal needs..."
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold"
                  >
                    Schedule Consultation
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to our privacy policy. Your information will be kept confidential.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Alternative Contact Section */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">Prefer to contact us directly?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+254727783214">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Call +254 727 783 214
                  </Button>
                </a>
                <a href="mailto:owinokojoadvocates@gmail.com">
                  <Button variant="outline" size="lg" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Email Us
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-8 text-center">
              What to Expect
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Confirmation",
                  description: "You'll receive an email confirmation with details about your consultation.",
                },
                {
                  step: "2",
                  title: "Preparation",
                  description: "We'll review your case details and match you with the best advocate for your needs.",
                },
                {
                  step: "3",
                  title: "Consultation",
                  description: "Meet with your advocate to discuss your case and explore your legal options.",
                },
              ].map((item, index) => (
                <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-2xl font-display font-bold text-accent-foreground">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2 text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookConsultation;