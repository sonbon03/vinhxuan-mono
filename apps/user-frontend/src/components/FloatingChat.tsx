import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useFloatingButtons } from "@/contexts/FloatingButtonsContext";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  typing?: boolean;
}

const FloatingChat = () => {
  const { toast } = useToast();
  const { setChatIsOpen } = useFloatingButtons();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "👋 Hello! I'm your AI legal assistant. I can help you with legal questions, document guidance, and connect you with attorneys. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Simulate new messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen && messages.length === 1) {
        setHasNewMessage(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const predefinedResponses = [
    {
      keywords: ['hello', 'hi', 'hey'],
      response: "Hello! I'm here to help you with legal questions. What would you like to know about?"
    },
    {
      keywords: ['contract', 'agreement'],
      response: "I can help you understand contracts! Are you looking to review, draft, or have questions about a specific type of contract? I can also connect you with a contract attorney."
    },
    {
      keywords: ['lawyer', 'attorney'],
      response: "I'd be happy to help you connect with a qualified attorney! What type of legal matter do you need assistance with? We have specialists in family law, corporate law, real estate, and more."
    },
    {
      keywords: ['real estate', 'property', 'house'],
      response: "Real estate law can be complex! Are you buying, selling, or dealing with property disputes? I can provide general guidance and connect you with our real estate attorneys."
    },
    {
      keywords: ['family law', 'divorce', 'custody'],
      response: "Family law matters require careful attention. I can provide general information about divorce, custody, and family legal processes. Would you like me to connect you with a family law specialist?"
    },
    {
      keywords: ['business', 'corporate', 'company'],
      response: "Business legal matters are important for your success! Are you starting a business, need contract help, or dealing with corporate compliance? I can guide you to the right resources."
    },
    {
      keywords: ['price', 'cost', 'fee'],
      response: "Legal fees vary depending on the type and complexity of your case. Many of our attorneys offer free consultations. Would you like me to schedule a consultation to discuss pricing?"
    }
  ];

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    for (const response of predefinedResponses) {
      if (response.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
        return response.response;
      }
    }
    
    return "Thank you for your question! While I can provide general legal information, for specific legal advice, I'd recommend speaking with one of our qualified attorneys. Would you like me to help you schedule a consultation?";
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Simulate AI thinking time and process response
    setTimeout(async () => {
      try {
        const aiResponse = await generateAIResponse(userMessage.content);
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender: 'ai',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error generating AI response:', error);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }, 1000 + Math.random() * 1500); // Random delay between 1-2.5 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isOpen) {
    return (
      <div className={cn(
        "fixed bottom-1 right-1 z-50 animate-in slide-in-from-bottom-4 duration-300",
        "w-[calc(100vw-0.5rem)] max-w-sm h-[85vh] max-h-96",
        "sm:w-96 sm:h-[500px] sm:max-h-[500px]",
        "sm:bottom-6 sm:right-6"
      )}>
        <Card className={cn(
          "w-full h-full flex flex-col border-0 shadow-2xl overflow-hidden backdrop-blur-md",
          "bg-white/95",
          isMinimized ? "h-14" : "h-full"
        )}>
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-primary to-accent text-white p-1.5 sm:p-2 md:p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-green-400 rounded-full border border-white sm:border-2"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-xs sm:text-sm font-semibold text-white truncate">Legal Assistant</CardTitle>
                  <p className="text-xs text-white/80 hidden sm:block">Online • Responds instantly</p>
                  <p className="text-xs text-white/80 sm:hidden">Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button> */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    setChatIsOpen(false);
                  }}
                  className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 p-0 text-white hover:bg-white/20 flex-shrink-0"
                >
                  <X className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <CardContent className="flex-1 p-1.5 sm:p-2 md:p-3 overflow-y-auto bg-gradient-to-b from-background to-accent/5">
                <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn(
                      "flex items-start space-x-1 sm:space-x-1.5 md:space-x-2",
                      msg.sender === 'user' ? "flex-row-reverse space-x-reverse" : ""
                    )}>
                      <Avatar className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0">
                        <AvatarFallback className={cn(
                          "text-xs",
                          msg.sender === 'user' 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-accent/20 text-accent"
                        )}>
                          {msg.sender === 'user' ? <User className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" /> : <Bot className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "max-w-[75%] sm:max-w-[80%] md:max-w-[85%] p-1.5 sm:p-2 md:p-3 rounded-2xl text-xs sm:text-sm min-w-0",
                        msg.sender === 'user'
                          ? "bg-primary text-primary-foreground rounded-br-md ml-auto"
                          : "bg-accent/10 text-foreground rounded-bl-md border border-accent/20"
                      )}>
                        <div className="whitespace-pre-wrap">
                          {msg.content}
                        </div>
                        <div className={cn(
                          "text-xs mt-1 opacity-70",
                          msg.sender === 'user' ? "text-right" : "text-left"
                        )}>
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex items-start space-x-2">
                      <Avatar className="w-7 h-7 flex-shrink-0">
                        <AvatarFallback className="bg-accent/20 text-accent text-xs">
                          <Bot className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-accent/10 p-3 rounded-2xl rounded-bl-md border border-accent/20">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-accent/60 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Quick actions - only show if no messages beyond initial */}
                  {messages.length === 1 && (
                    <div className="space-y-2 mt-4">
                      <div className="text-xs text-muted-foreground text-center">Quick Actions</div>
                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-xs justify-start"
                          onClick={() => setMessage("I need help with a contract")}
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Contract Help
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs justify-start" asChild>
                          <Link to="/chat">
                            <User className="w-3 h-3 mr-1" />
                            Live Attorney
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Input Area */}
              <div className="border-t border-border p-1.5 sm:p-2 md:p-3 bg-background">
                <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">
                  <Input
                    placeholder="Ask your legal question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 text-xs sm:text-sm border-0 bg-muted/50 focus:bg-background h-7 sm:h-8 md:h-9 min-w-0"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-accent hover:bg-accent/90 h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0 flex-shrink-0"
                  >
                    <Send className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-1 sm:mt-1.5 md:mt-2 text-xs text-muted-foreground">
                  <span className="hidden sm:inline">Press Enter to send</span>
                  <span className="sm:hidden">Enter to send</span>
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                    <Link to="/chat">
                      <span className="hidden sm:inline">Open full chat →</span>
                      <span className="sm:hidden">Full chat →</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 z-50 group">
      <Button
        onClick={() => {
          setIsOpen(true);
          setChatIsOpen(true);
        }}
        className={cn(
          "h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full shadow-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 hover:scale-110",
          "animate-bounce hover:animate-none active:animate-none focus:animate-none",
          hasNewMessage && "!animate-pulse"
        )}
        style={{
          animationDuration: '0.6s',
          animationIterationCount: 'infinite',
          animationTimingFunction: hasNewMessage ? 'ease-in-out' : 'cubic-bezier(0.4, 0, 0.6, 1)'
        }}
      >
        <div className="relative">
          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
          {hasNewMessage && (
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-red-500 rounded-full animate-ping">
              <div className="absolute inset-0 w-full h-full bg-red-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </Button>
      
      {/* Tooltip */}
      <div className="absolute top-1/2 right-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none transform -translate-y-1/2 -translate-x-2">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
          Trợ lý pháp lý AI - Chat ngay!
          <div className="absolute top-1/2 left-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900 transform -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default FloatingChat;