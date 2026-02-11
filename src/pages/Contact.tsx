import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetContactInfoQuery,
  useSubmitContactFormMutation,
  type ContactFormData
} from "@/features/Contact/contactApi";
import bg from '@/assets/act-vs-law.jpg';

const Contact = () => {
  const { toast } = useToast();

  // RTK Query hooks
  const { data: contactInfo, isLoading: isLoadingInfo, error: infoError } = useGetContactInfoQuery();
  const [submitContactForm, { isLoading: isSubmitting }] = useSubmitContactFormMutation();

  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form data being sent:', formData);
    try {
      const response = await submitContactForm(formData).unwrap();

      toast({
        title: "Message Sent Successfully!",
        description: (
          <div className="flex flex-col gap-2">
            <p>{response.message}</p>
            <p className="text-sm font-semibold">Reference: {response.data.referenceNumber}</p>
            <p className="text-xs opacity-80">Expected response time: {response.data.estimatedResponse}</p>
          </div>
        ),
        duration: 5000,
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      const errorMessage = error?.data?.error || "Failed to send message. Please try again or contact us directly.";
      const supportPhone = error?.data?.supportPhone;
      const supportEmail = error?.data?.supportEmail;

      toast({
        title: "Error Sending Message",
        description: (
          <div className="flex flex-col gap-2">
            <p>{errorMessage}</p>
            {supportPhone && (
              <p className="text-sm">Call us: <span className="font-semibold">{supportPhone}</span></p>
            )}
            {supportEmail && (
              <p className="text-sm">Email: <span className="font-semibold">{supportEmail}</span></p>
            )}
          </div>
        ),
        variant: "destructive",
        duration: 7000,
      });
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Subject mapping for display
  const subjectDisplayMap: { [key: string]: string } = {
    'consultation': 'Free Consultation',
    'corporate': 'Corporate & Commercial Law',
    'litigation': 'Litigation & Dispute Resolution',
    'family': 'Family & Matrimonial Law',
    'land': 'Land & Property Law',
    'employment': 'Employment & Labour Law',
    'criminal': 'Criminal Defense',
    'other': 'Other'
  };

  // Get contact data with fallbacks
  const contactData = {
    address: contactInfo?.data?.contacts?.address || "Lower Hill Duplex, 2nd Floor\nUpper Hill, Nairobi",
    phones: contactInfo?.data?.contacts?.phone || ["+254 727 783 214"],
    emails: contactInfo?.data?.contacts?.email || ["info@owinokojoadvocates.com", "consult@owinokojoadvocates.com"],
    officeHours: {
      weekdays: contactInfo?.data?.officeHours?.weekdays || "Mon-Fri: 8AM - 5PM",
      saturday: contactInfo?.data?.officeHours?.saturday || "Sat: 10AM - 2PM"
    },
    subjects: contactInfo?.data?.subjects || Object.values(subjectDisplayMap)
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      {/* <section className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Get in touch with our legal experts. We're here to help you navigate your legal challenges in Kenya.
            </p>
          </div>
        </div>
      </section> */}
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
              Contact Us
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Get in touch with our legal experts. We're here to help you navigate your legal challenges in Kenya.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          {isLoadingInfo ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: MapPin,
                  title: "Visit Us",
                  content: contactData.address,
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  content: contactData.phones.join('\n'),
                },
                {
                  icon: Mail,
                  title: "Email Us",
                  content: contactData.emails.join('\n'),
                },
                {
                  icon: Clock,
                  title: "Office Hours",
                  content: `${contactData.officeHours.weekdays}\n${contactData.officeHours.saturday}`,
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
          )}
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
                Fill out the form below and one of our experienced advocates will get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      required
                      className="mt-2"
                      disabled={isSubmitting}
                    // placeholder="John"
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
                      disabled={isSubmitting}
                    // placeholder="Doe"
                    />
                  </div>
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
                    disabled={isSubmitting}
                  // placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="mt-2"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => handleChange("subject", value)}
                    disabled={isSubmitting || isLoadingInfo}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingInfo ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        Object.entries(subjectDisplayMap).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    required
                    rows={6}
                    className="mt-2"
                    placeholder="Tell us about your legal needs..."
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
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
                      "Experienced advocates across all practice areas",
                      "Deep understanding of Kenyan law and legal system",
                      "Transparent communication and regular case updates",
                      "Competitive rates and flexible payment options",
                      "95% client satisfaction rate",
                      "Serving clients across all 47 counties in Kenya",
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
                    Need Urgent Legal Assistance?
                  </h3>
                  <p className="opacity-90 mb-6">
                    Facing an urgent legal matter? Contact us immediately for prompt legal assistance and consultation.
                  </p>
                  <Button
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => window.location.href = `tel:${contactData.phones[0]}`}
                    disabled={isLoadingInfo}
                  >
                    {isLoadingInfo ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>Call Now: {contactData.phones[0]}</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      {/* <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-8 text-center">
              Find Us in Nairobi
            </h2>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-elegant bg-primary/5 flex items-center justify-center">
              {isLoadingInfo ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-muted-foreground">Loading location...</span>
                </div>
              ) : (
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2 font-semibold">
                    Owino Kojo & Co. Advocates
                  </p>
                  <p className="text-muted-foreground text-sm whitespace-pre-line">
                    {contactData.address}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section> */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-8 text-center">
              Find Us in Nairobi
            </h2>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-elegant">
              {isLoadingInfo ? (
                <div className="bg-primary/5 flex items-center justify-center h-full">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-muted-foreground">Loading location...</span>
                  </div>
                </div>
              ) : (
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.792109900035!2d36.81764547408077!3d-1.299536835638881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1166edb58df7%3A0x332d7f34bb9d828e!2sLowerhill%20Duplex%20Building!5e0!3m2!1sen!2ske!4v1770785118504!5m2!1sen!2ske" width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              )}
            </div>
            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 inline mr-1" />
                {contactData.address.replace('\n', ', ')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;