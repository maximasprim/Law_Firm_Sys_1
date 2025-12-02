import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, ArrowRight, Search, ExternalLink } from "lucide-react";
import { useState } from "react";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Data Protection", "Employment Law", "Corporate Law", "Property Law", "Cybersecurity"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const blogPosts = [
    {
      title: "Data Protection Act Kenya: 2024 Updates and Compliance Requirements",
      excerpt: "Understanding the enhanced data subject rights, breach notification requirements, and increased penalties under the Data Protection Act amendments for 2024.",
      category: "Data Protection",
      source: "Sentinel Africa Consulting",
      date: "November 4, 2024",
      readTime: "10 min read",
      url: "https://sentinelafricaconsulting.com/data-protection-act-kenya-compliance/",
    },
    {
      title: "Kenya's Computer Misuse and Cybercrimes (Amendment) Act 2024",
      excerpt: "Breaking down the key amendments addressing SIM-swap fraud, phishing, cyber harassment, and critical information infrastructure protection.",
      category: "Cybersecurity",
      source: "Manwa OH Advocates LLP",
      date: "October 23, 2025",
      readTime: "12 min read",
      url: "https://manwaadvocates.com/latest-update-kenyas-computer-misuse-and-cybercrimes-amendment-act-2024/",
    },
    {
      title: "Recent Employment Law Reforms in Kenya: What Employers Need to Know",
      excerpt: "Comprehensive analysis of the Affordable Housing Levy, Social Health Insurance Fund, NSSF Act implementation, and Persons with Disabilities Act 2025.",
      category: "Employment Law",
      source: "DLA Piper",
      date: "May 30, 2025",
      readTime: "15 min read",
      url: "https://knowledge.dlapiper.com/dlapiperknowledge/globalemploymentlatestdevelopments/2025/recent-employment-law-reforms-in-kenya",
    },
    {
      title: "Data Privacy Analysis of the Kenyan Finance Bill 2024",
      excerpt: "Critical examination of Clause 63 amendments to the Data Protection Act giving KRA broader access to personal data for tax enforcement.",
      category: "Data Protection",
      source: "CIPIT - Strathmore University",
      date: "June 20, 2024",
      readTime: "8 min read",
      url: "https://cipit.org/a-data-privacy-analysis-of-the-kenyan-finance-bill-2024/",
    },
    {
      title: "Kenya Business Laws (Amendment) Bill 2024: Key Provisions Explained",
      excerpt: "Analysis of updated employment definitions for remote work, banking sector reforms, and foreign direct investment registration requirements.",
      category: "Corporate Law",
      source: "Spencer West LLP",
      date: "September 26, 2025",
      readTime: "12 min read",
      url: "https://www.spencer-west.com/news/kenya-business-laws-amendment-bill-2024/",
    },
    {
      title: "Land Registration Act Kenya: A Complete Guide",
      excerpt: "Essential steps for land transactions, title transfers, stamp duty payments, and understanding the digitized land registration system.",
      category: "Property Law",
      source: "Icon Prime Properties",
      date: "March 25, 2025",
      readTime: "10 min read",
      url: "https://iconprime.co.ke/blog/land-registration-act-kenya-a-complete-guide/",
    },
    {
      title: "Employment Law Changes in Kenya: Right to Disconnect",
      excerpt: "Exploring the Employment (Amendment) Bill 2021 introducing employees' right to disconnect from work after hours and implications for employers.",
      category: "Employment Law",
      source: "Global People Strategist",
      date: "September 11, 2025",
      readTime: "7 min read",
      url: "https://globalpeoplestrategist.com/employment-law-changes-in-kenya/",
    },
    {
      title: "Data Protection Laws in Kenya: Current Framework and Regulations",
      excerpt: "Overview of the Data Protection Act 2019, ODPC guidelines, and compliance requirements for data controllers and processors in Kenya.",
      category: "Data Protection",
      source: "DLA Piper Data Protection",
      date: "2024",
      readTime: "9 min read",
      url: "https://www.dlapiperdataprotection.com/index.html?t=law&c=KE",
    },
    {
      title: "Kenya's Employment Act: Recent Amendments and Requirements",
      excerpt: "Understanding statutory deductions, housing levy requirements, social health insurance, and NSSF contributions for Kenyan employers.",
      category: "Employment Law",
      source: "Paul Hastings LLP",
      date: "2024",
      readTime: "8 min read",
      url: "https://www.paulhastings.com/insights/practice-area-articles/kenya",
    },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Legal Resources & Insights
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Curated articles, legal updates, and practical guidance on Kenyan law from leading legal practitioners and institutions
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    selectedCategory === category
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground italic">
              <strong>Note:</strong> These articles are sourced from various legal publications and law firms across Kenya. Click "Read Article" to access the original sources. All content remains the property of the respective publishers.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Card
                key={index}
                className="group hover:shadow-elegant transition-all duration-300 border-border hover:border-accent animate-slide-up overflow-hidden flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary to-primary-light relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-display font-bold text-primary-foreground opacity-50">
                      {post.category.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6 flex flex-col flex-1">
                  <Badge variant="secondary" className="mb-3 w-fit">
                    {post.category}
                  </Badge>
                  
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="space-y-3 mt-auto">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.source}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>

                    <a 
                      href={post.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full"
                    >
                      <Button variant="ghost" className="group/btn p-0 h-auto font-semibold text-primary hover:text-accent w-full justify-start">
                        Read Article
                        <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Official Resources Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-primary mb-8 text-center">
              Official Legal Resources
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Kenya Law Reports</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access the official repository of Kenyan laws, acts, and regulations.
                  </p>
                  <a href="https://www.kenyalaw.org" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="group">
                      Visit Kenya Law
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Office of Data Protection Commissioner</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Official guidelines and regulations on data protection in Kenya.
                  </p>
                  <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="group">
                      Visit ODPC
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">National Land Commission</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Land laws, regulations, and guidelines for property transactions.
                  </p>
                  <a href="https://landcommission.go.ke" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="group">
                      Visit NLC
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Law Society of Kenya</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Professional body regulating legal practice in Kenya.
                  </p>
                  <a href="https://www.lsk.or.ke" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="group">
                      Visit LSK
                      <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Stay Updated on Kenyan Law
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Contact us to receive updates on legal developments and important changes in Kenyan legislation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold whitespace-nowrap">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;