import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, ArrowRight, Search } from "lucide-react";
import { useState } from "react";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Corporate Law", "Litigation", "Family Law", "Real Estate", "Tax Law"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const blogPosts = [
    {
      title: "Understanding the New Corporate Compliance Requirements for 2025",
      excerpt: "Recent regulatory changes require businesses to update their compliance frameworks. Learn what your company needs to know.",
      category: "Corporate Law",
      author: "Michael Harrison",
      date: "March 15, 2025",
      readTime: "8 min read",
      image: "corporate",
    },
    {
      title: "Top 5 Mistakes to Avoid in Commercial Litigation",
      excerpt: "Commercial disputes can be costly. Discover the most common pitfalls and how to avoid them in your litigation strategy.",
      category: "Litigation",
      author: "Sarah Chen",
      date: "March 12, 2025",
      readTime: "6 min read",
      image: "litigation",
    },
    {
      title: "Estate Planning Essentials: Protecting Your Family's Future",
      excerpt: "A comprehensive guide to creating a robust estate plan that ensures your wishes are honored and your loved ones are protected.",
      category: "Estate Planning",
      author: "Emily Thompson",
      date: "March 10, 2025",
      readTime: "10 min read",
      image: "estate",
    },
    {
      title: "Navigating Child Custody Laws: A Parent's Guide",
      excerpt: "Understanding custody arrangements, parenting time, and what courts consider when making custody decisions.",
      category: "Family Law",
      author: "Emily Thompson",
      date: "March 8, 2025",
      readTime: "7 min read",
      image: "family",
    },
    {
      title: "Commercial Real Estate Transactions: Due Diligence Checklist",
      excerpt: "Essential steps and considerations for successful commercial property acquisitions and sales.",
      category: "Real Estate",
      author: "Robert Williams",
      date: "March 5, 2025",
      readTime: "9 min read",
      image: "realestate",
    },
    {
      title: "Tax Strategies for Small Business Owners in 2025",
      excerpt: "Maximize your deductions and minimize your tax liability with these proven strategies for entrepreneurs.",
      category: "Tax Law",
      author: "David Martinez",
      date: "March 1, 2025",
      readTime: "5 min read",
      image: "tax",
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
              Legal Insights & News
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Expert analysis, legal updates, and practical guidance from our experienced attorneys
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

      {/* Blog Posts Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Card
                key={index}
                className="group hover:shadow-elegant transition-all duration-300 border-border hover:border-accent animate-slide-up overflow-hidden"
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

                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">
                    {post.category}
                  </Badge>
                  
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
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

                  <Button variant="ghost" className="group/btn p-0 h-auto font-semibold text-primary hover:text-accent">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Stay Informed
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Subscribe to our newsletter for legal updates, insights, and exclusive content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
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

export default Blog;
