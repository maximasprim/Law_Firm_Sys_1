import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PracticeAreas from "./pages/PracticeAreas";
import Advocates from "./pages/Advocates";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import CaseResults from "./pages/CaseResults";
import Resources from "./pages/Resources";
import Testimonials from "./pages/Testimonials";
import Careers from "./pages/Careers";
import BookConsultation from "./pages/BookConsultation";
import NotFound from "./pages/NotFound";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import LawFirmDashboard from "./pages/Admin/Dashboard";
import ClientRegistration from "./features/Registration/ClientRegistration";
import LegalLogin from "./features/Registration/login";
import AdvocateRegistration from "./features/Registration/AdvocateRegistration";
import ForgotPassword from "./features/PasswordReset/ForgotPassword";
import ResetPassword from "./features/PasswordReset/Reset";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/practice-areas" element={<PracticeAreas />} />
              <Route path="/advocates" element={<Advocates />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/case-results" element={<CaseResults />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/book-consultation" element={<BookConsultation />} />
              <Route path="/admin/dashboard" element={<LawFirmDashboard />} />
              <Route path="/client-registration" element={<ClientRegistration />} />
              <Route path="/legal-login" element={<LegalLogin />} />
              <Route path="/advocate-registration" element={<AdvocateRegistration />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
