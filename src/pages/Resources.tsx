import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Video, BookOpen, Calculator, CheckCircle2 } from "lucide-react";

const Resources = () => {
  const guides = [
    {
      title: "Business Formation Guide",
      description: "Complete guide to choosing the right business structure and formation process.",
      category: "Corporate Law",
      pages: "45 pages",
      format: "PDF",
    },
    {
      title: "Estate Planning Checklist",
      description: "Essential checklist for creating a comprehensive estate plan for your family.",
      category: "Estate Planning",
      pages: "12 pages",
      format: "PDF",
    },
    {
      title: "Divorce Process Overview",
      description: "What to expect during divorce proceedings and how to prepare effectively.",
      category: "Family Law",
      pages: "28 pages",
      format: "PDF",
    },
    {
      title: "Employment Contract Template",
      description: "Customizable employment agreement template with key provisions explained.",
      category: "Employment Law",
      pages: "15 pages",
      format: "DOC",
    },
    {
      title: "Real Estate Purchase Guide",
      description: "Step-by-step guide to commercial and residential real estate transactions.",
      category: "Real Estate",
      pages: "38 pages",
      format: "PDF",
    },
    {
      title: "IP Protection Strategies",
      description: "How to protect your intellectual property, patents, trademarks, and copyrights.",
      category: "IP Law",
      pages: "52 pages",
      format: "PDF",
    },
  ];

  const videos = [
    {
      title: "Understanding Corporate Compliance",
      duration: "12:45",
      views: "2.4K",
    },
    {
      title: "Estate Planning Basics",
      duration: "15:30",
      views: "3.1K",
    },
    {
      title: "What to Do After a Car Accident",
      duration: "8:20",
      views: "5.2K",
    },
    {
      title: "Starting a Business: Legal Essentials",
      duration: "18:15",
      views: "4.8K",
    },
  ];

  const tools = [
    {
      icon: Calculator,
      title: "Child Support Calculator",
      description: "Estimate child support obligations based on state guidelines.",
    },
    {
      icon: Calculator,
      title: "Personal Injury Settlement Estimator",
      description: "Get a rough estimate of potential settlement values.",
    },
    {
      icon: FileText,
      title: "Legal Document Builder",
      description: "Create basic legal documents with our guided form tool.",
    },
    {
      icon: CheckCircle2,
      title: "Case Evaluation Tool",
      description: "Answer questions to get initial assessment of your case strength.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Legal Resources
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Free guides, tools, and educational content to help you understand your legal matters
            </p>
          </div>
        </div>
      </section>

      {/* Downloadable Guides */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-accent" />
              <h2 className="text-4xl font-display font-bold text-primary">
                Free Legal Guides
              </h2>
            </div>
            <p className="text-xl text-muted-foreground">
              Download comprehensive guides on various legal topics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide, index) => (
              <Card
                key={index}
                className="group hover:shadow-elegant transition-all duration-300 border-border hover:border-accent animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 p-4 bg-primary/10 rounded-lg w-fit group-hover:bg-accent group-hover:shadow-gold transition-all duration-300">
                    <FileText className="h-8 w-8 text-primary group-hover:text-accent-foreground" />
                  </div>

                  <Badge variant="secondary" className="mb-3">
                    {guide.category}
                  </Badge>

                  <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                    {guide.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {guide.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span>{guide.pages}</span>
                    <span>•</span>
                    <span>{guide.format}</span>
                  </div>

                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Download className="mr-2 h-4 w-4" />
                    Download Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Library */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Video className="h-8 w-8 text-accent" />
              <h2 className="text-4xl font-display font-bold text-primary">
                Video Library
              </h2>
            </div>
            <p className="text-xl text-muted-foreground">
              Watch educational videos from our attorneys
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {videos.map((video, index) => (
              <Card
                key={index}
                className="group hover:shadow-elegant transition-all duration-300 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-video bg-gradient-to-br from-primary to-primary-light overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-4 rounded-full bg-accent/20 group-hover:bg-accent/30 transition-all">
                      <Video className="h-12 w-12 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{video.views} views</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Tools */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calculator className="h-8 w-8 text-accent" />
              <h2 className="text-4xl font-display font-bold text-primary">
                Legal Tools & Calculators
              </h2>
            </div>
            <p className="text-xl text-muted-foreground">
              Use our tools to get quick answers and estimates
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {tools.map((tool, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-elegant transition-all duration-300 border-border hover:border-accent animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 mx-auto p-4 bg-primary/10 rounded-full w-fit hover:bg-accent hover:shadow-gold transition-all duration-300 group">
                    <tool.icon className="h-8 w-8 text-primary group-hover:text-accent-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Get More Resources
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Subscribe to receive new guides, articles, and legal updates directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md bg-background/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resources;
