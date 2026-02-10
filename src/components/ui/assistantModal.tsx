import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import logo from "@/assets/logo 2.png";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = "legal_assistant_messages";

const AIAssistantModal = ({ isOpen, onClose }: AIAssistantModalProps) => {
  const initialMessages: Message[] = [
    {
      id: "1",
      text: "Hello! I'm your legal assistant. How can I help you today? I can answer questions about our practice areas, book consultations, or provide general information about our services.",
      sender: "assistant",
      timestamp: new Date(),
    },
  ];

  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from sessionStorage on initial render
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      } catch {
        return initialMessages;
      }
    }
    return initialMessages;
  });

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle clicks outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getAssistantResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Practice areas responses
    if (lowerMessage.includes("practice") || lowerMessage.includes("service") || lowerMessage.includes("what do you")) {
      return "We specialize in four main practice areas:\n\n1. Corporate Governance - Expert guidance on corporate law and compliance\n2. Legal Risk Management - Comprehensive risk audit and analysis\n3. Commercial Law - Banking, financing, insurance, and property transactions\n4. Litigation - Expert representation in civil and commercial suits\n\nWould you like to know more about any specific area?";
    }

    // Corporate law
    if (lowerMessage.includes("corporate") || lowerMessage.includes("business") || lowerMessage.includes("governance")) {
      return "Our Corporate Governance services include:\n• Corporate law advisory\n• Business development support\n• Regulatory compliance\n• Corporate structuring\n• Board advisory services\n\nWould you like to schedule a consultation to discuss your corporate needs?";
    }

    // Litigation
    if (lowerMessage.includes("litigation") || lowerMessage.includes("court") || lowerMessage.includes("lawsuit") || lowerMessage.includes("sue")) {
      return "Our Litigation team provides expert representation in:\n• Civil suits\n• Commercial disputes\n• Judicial review\n• Arbitral tribunals\n• Appeals\n\nWith a 95% success rate, we're committed to achieving the best outcome for your case. Would you like to discuss your legal matter?";
    }

    // Commercial law
    if (lowerMessage.includes("commercial") || lowerMessage.includes("banking") || lowerMessage.includes("property") || lowerMessage.includes("insurance")) {
      return "Our Commercial Law services cover:\n• Banking and financing\n• Insurance law\n• Property transactions\n• Contract negotiation\n• Commercial agreements\n\nHow can we assist you with your commercial legal needs?";
    }

    // Risk management
    if (lowerMessage.includes("risk")) {
      return "Our Legal Risk Management services include:\n• Comprehensive risk audits\n• Risk identification and analysis\n• Risk mitigation strategies\n• Compliance management\n• Ongoing risk monitoring\n\nWe help organizations proactively manage legal risks. Shall we schedule a consultation?";
    }

    // Consultation/booking
    if (lowerMessage.includes("consult") || lowerMessage.includes("appointment") || lowerMessage.includes("book") || lowerMessage.includes("meet")) {
      return "I'd be happy to help you book a consultation! We offer free initial consultations.\n\nYou can:\n• Click the 'Free Consultation' button on our homepage\n• Call us at (254) 727 783 214\n• Visit our Contact page to fill out a form\n\nOur team typically responds within 24 hours. What time works best for you?";
    }

    // Contact information
    if (lowerMessage.includes("contact") || lowerMessage.includes("phone") || lowerMessage.includes("email") || lowerMessage.includes("address") || lowerMessage.includes("location")) {
      return "Here's how you can reach us:\n\n📞 Phone: (254) 727 783 214\n📱 WhatsApp: Click the green icon at the bottom right\n⏰ Hours: Monday - Friday, 8:00 AM - 6:00 PM\n\nWe also offer 24/7 emergency legal services for urgent matters. How else can I assist you?";
    }

    // Pricing/fees
    if (lowerMessage.includes("cost") || lowerMessage.includes("price") || lowerMessage.includes("fee") || lowerMessage.includes("how much")) {
      return "Our fees vary depending on the nature and complexity of your case. We offer:\n• Free initial consultations\n• Transparent pricing structures\n• Flexible payment arrangements\n\nI'd recommend booking a free consultation where we can discuss your specific needs and provide a detailed fee structure. Would you like to schedule one?";
    }

    // Experience/credentials
    if (lowerMessage.includes("experience") || lowerMessage.includes("credential") || lowerMessage.includes("qualification") || lowerMessage.includes("about")) {
      return "Owino Kojo & Co. Advocates has been providing exceptional legal services since 2014. Our achievements include:\n\n• 10+ years of experience\n• 300+ cases won\n• 10+ expert advocates\n• 95% success rate\n• 95% client satisfaction\n\nWe're committed to excellence and building lasting relationships with our clients. What specific legal matter can we help you with?";
    }

    // Hours/availability
    if (lowerMessage.includes("hour") || lowerMessage.includes("open") || lowerMessage.includes("available") || lowerMessage.includes("when")) {
      return "Our office hours are:\n• Monday - Friday: 8:00 AM - 6:00 PM\n• Saturday: By appointment only\n• Sunday: Closed\n\nWe also provide 24/7 emergency legal services for urgent matters. Would you like to schedule an appointment?";
    }

    // Greetings
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! Welcome to Owino Kojo & Co. Advocates. I'm here to help you with information about our legal services. What would you like to know?";
    }

    // Thanks
    if (lowerMessage.includes("thank")) {
      return "You're very welcome! If you have any other questions or would like to schedule a consultation, feel free to ask. We're here to help!";
    }

    // Default response
    return "Thank you for your message. For specific legal advice or detailed information about your case, I recommend booking a free consultation with one of our experienced advocates. You can do this by:\n\n• Calling us at (254) 727 783 214\n• Using the WhatsApp button below\n• Clicking 'Free Consultation' on our website\n\nIs there anything else I can help you with?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const responseText = getAssistantResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-scale-in">
      <Card 
        ref={modalRef}
        className="w-[350px] h-[450px] shadow-2xl border-4 border-accent/20 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              {/* <Bot className="h-5 w-5 text-white" /> */}
              <img
                            src={logo}
                            alt="Owino Kojo Advocates Logo"
                            className="h-8 w-8 sm:h-8 sm:w-8"
                          />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-lg">
                Your Legal Assistant
              </h3>
              <p className="text-xs text-white/80">Online • Typically replies instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
            aria-label="Close assistant"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === "user"
                    ? "bg-accent text-accent-foreground shadow-gold"
                    : "bg-white border border-border text-foreground shadow-sm"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {message.text}
                </p>
                <span className="text-xs opacity-60 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-border rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  <span className="text-sm text-muted-foreground">
                    Assistant is typing...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-background border-t border-border">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm bg-white"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="rounded-full bg-accent hover:bg-accent/90 shadow-gold h-10 w-10 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            For legal advice, please schedule a consultation
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistantModal;