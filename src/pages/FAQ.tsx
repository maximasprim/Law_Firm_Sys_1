import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const FAQ = () => {
  const faqCategories = [
    {
      category: "General Questions",
      questions: [
        {
          q: "What areas of law does Owino Kojo Advocates practice?",
          a: "We practice in multiple areas including corporate law, litigation, family law, estate planning, real estate, intellectual property, employment law, personal injury, criminal defense, tax law, immigration, and bankruptcy. Our diverse team of attorneys brings expertise across all major legal practice areas.",
        },
        {
          q: "How much does legal representation cost?",
          a: "Legal fees vary depending on the complexity of your case and the practice area. We offer transparent pricing and will discuss all costs during your free initial consultation. We also provide flexible payment plans and work on contingency for certain case types.",
        },
        {
          q: "Do you offer free consultations?",
          a: "Yes! We provide a free initial consultation for all new clients. This allows us to understand your legal needs and for you to learn about our services without any financial commitment.",
        },
      ],
    },
    {
      category: "Working With Us",
      questions: [
        {
          q: "How quickly will you respond to my case?",
          a: "We pride ourselves on responsive communication. Most inquiries receive a response within 24 hours. For emergency legal matters, we offer 24/7 availability and can often provide same-day consultations.",
        },
        {
          q: "Will I work directly with an attorney?",
          a: "Absolutely. You will have a dedicated attorney assigned to your case who will be your primary point of contact. Our attorneys personally handle all critical aspects of your legal matter.",
        },
        {
          q: "How do you communicate case updates?",
          a: "We maintain regular communication through your preferred method—phone, email, or in-person meetings. You'll receive updates at key milestones and can reach out anytime with questions.",
        },
      ],
    },
    {
      category: "Case Process",
      questions: [
        {
          q: "How long will my case take?",
          a: "Case duration varies significantly based on complexity, practice area, and other factors. During your consultation, we'll provide a realistic timeline based on similar cases and keep you informed of any changes as your case progresses.",
        },
        {
          q: "What documents should I bring to my consultation?",
          a: "Bring any relevant documents related to your legal matter, such as contracts, correspondence, court documents, financial records, or other pertinent materials. Don't worry if you don't have everything—we'll guide you through what's needed.",
        },
        {
          q: "What are my chances of success?",
          a: "While we can't guarantee outcomes, we can provide an honest assessment based on our experience with similar cases. During your consultation, we'll discuss the strengths and challenges of your case and our strategic approach.",
        },
      ],
    },
    {
      category: "Payment & Billing",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept cash, checks, credit cards, wire transfers, and can arrange flexible payment plans. We'll work with you to find a payment structure that fits your situation.",
        },
        {
          q: "Do you work on contingency?",
          a: "Yes, for certain case types including personal injury and some civil litigation matters. In contingency arrangements, you only pay if we win your case. We'll explain if your case qualifies during the consultation.",
        },
        {
          q: "Are there any hidden fees?",
          a: "No. We believe in transparent billing. All fees and potential costs will be clearly explained before we begin work on your case. You'll receive detailed billing statements showing all charges.",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <HelpCircle className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Find answers to common questions about our legal services and how we can help you.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="animate-slide-up" style={{ animationDelay: `${categoryIndex * 100}ms` }}>
                <h2 className="text-3xl font-display font-bold text-primary mb-6">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((item, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${categoryIndex}-${index}`}
                      className="border border-border rounded-lg px-6 hover:border-accent transition-colors"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-6">
                        <span className="font-semibold text-foreground pr-4">{item.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-accent shadow-elegant">
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-16 w-16 text-accent mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
                Still Have Questions?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our team is here to help. Contact us for a free consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NavLink to="/contact">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
                    Contact Us
                  </Button>
                </NavLink>
                <Button size="lg" variant="outline">
                  Call (212) 555-0123
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-primary mb-8 text-center">
              Helpful Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Practice Areas", description: "Explore our legal services", link: "/practice-areas" },
                { title: "Our Attorneys", description: "Meet our legal team", link: "/attorneys" },
                { title: "About Us", description: "Learn our story", link: "/about" },
              ].map((resource, index) => (
                <NavLink key={index} to={resource.link}>
                  <Card className="h-full hover:shadow-elegant hover:border-accent transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {resource.description}
                      </p>
                    </CardContent>
                  </Card>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
