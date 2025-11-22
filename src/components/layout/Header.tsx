import { Scale, Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/practice-areas", label: "Practice Areas" },
    { to: "/attorneys", label: "Attorneys" },
    { to: "/about", label: "About" },
    { to: "/case-results", label: "Results" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-primary rounded-lg group-hover:shadow-gold transition-all duration-300">
              <Scale className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-display font-bold text-primary">Premier Law</span>
              <span className="block text-xs text-muted-foreground font-body">Associates</span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
                activeClassName="text-primary font-semibold"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <NavLink to="/book-consultation">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold">
                Book Consultation
              </Button>
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-6 animate-fade-in">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className="text-base font-medium text-foreground/80 hover:text-primary transition-colors px-2 py-2"
                  activeClassName="text-primary font-semibold bg-muted rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="flex flex-col gap-3 mt-4 px-2">
                <NavLink to="/book-consultation" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Book Consultation
                  </Button>
                </NavLink>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
