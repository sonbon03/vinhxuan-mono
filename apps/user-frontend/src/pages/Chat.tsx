import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Send, 
  Bot, 
  User, 
  Users, 
  MessageCircle, 
  Clock, 
  Phone,
  Video,
  Paperclip,
  Smile,
  MoreVertical,
  Search,
  Star,
  Archive,
  CheckCircle2,
  Shield,
  Zap,
  FileText,
  Calendar,
  Globe,
  Menu
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Chat = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("ai");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState({
    ai: [
      {
        id: 1,
        sender: "ai",
        content: "Hello! I'm your AI legal assistant. I can help you with basic legal questions, document templates, and guide you through common legal processes. How can I assist you today?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        avatar: "/src/assets/legal-services.jpg"
      }
    ],
    lawyer: [
      {
        id: 1,
        sender: "lawyer",
        content: "Good afternoon! I'm Sarah Johnson, one of the attorneys here. I received your case inquiry and I'm ready to discuss your legal matter. What specific legal issue can I help you with?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        avatar: "/src/assets/hero-legal.jpg",
        name: "Sarah Johnson, Esq."
      },
      {
        id: 2,
        sender: "user",
        content: "Hi Sarah, thank you for getting back to me. I need help with a real estate contract review. The seller is pushing for a quick closing and I want to make sure I'm protected.",
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        avatar: "",
        name: "You"
      },
      {
        id: 3,
        sender: "lawyer",
        content: "Absolutely, I understand your concern. Quick closings can sometimes lead to overlooked details. I'd be happy to review the contract for you. Can you tell me more about the specific clauses or terms that are concerning you?",
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        avatar: "/src/assets/hero-legal.jpg",
        name: "Sarah Johnson, Esq."
      }
    ]
  });
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationHistory = [
    {
      id: 1,
      type: "ai",
      title: "Business Formation Questions",
      lastMessage: "Thank you for the information about LLC formation...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unread: 0
    },
    {
      id: 2,
      type: "lawyer",
      title: "Contract Review - Sarah Johnson",
      lastMessage: "I'll review the contract and get back to you...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      unread: 2
    },
    {
      id: 3,
      type: "ai",
      title: "Estate Planning Guidance",
      lastMessage: "Here are the documents you'll need for estate planning...",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      unread: 0
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    return "I understand your question. Let me provide you with some guidance on this legal matter. Based on what you've described, here are the key points you should consider...";
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: "user",
      content: newMessage,
      timestamp: new Date(),
      avatar: "",
      name: "You"
    };

    setMessages(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab as keyof typeof prev], message]
    }));

    setNewMessage("");
    setIsTyping(true);

    // Simulate response
    setTimeout(async () => {
      try {
        const content = activeTab === "ai" 
          ? await generateAIResponse(message.content)
          : "Thank you for that information. I'll review this carefully and provide you with my professional analysis. In the meantime, please gather any additional documentation that might be relevant.";

        const response = {
          id: Date.now() + 1,
          sender: activeTab,
          content,
          timestamp: new Date(),
          avatar: activeTab === "ai" ? "/src/assets/legal-services.jpg" : "/src/assets/hero-legal.jpg",
          name: activeTab === "ai" ? "AI Legal Assistant" : "Sarah Johnson, Esq."
        };

        setMessages(prev => ({
          ...prev,
          [activeTab]: [...prev[activeTab as keyof typeof prev], response]
        }));
      } catch (error) {
        console.error('Error generating response:', error);
        const errorResponse = {
          id: Date.now() + 1,
          sender: activeTab,
          content: "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
          timestamp: new Date(),
          avatar: activeTab === "ai" ? "/src/assets/legal-services.jpg" : "/src/assets/hero-legal.jpg",
          name: activeTab === "ai" ? "AI Legal Assistant" : "Sarah Johnson, Esq."
        };
        
        setMessages(prev => ({
          ...prev,
          [activeTab]: [...prev[activeTab as keyof typeof prev], errorResponse]
        }));
      } finally {
        setIsTyping(false);
      }
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const currentMessages = messages[activeTab as keyof typeof messages];

  // Sidebar component for reuse
  const SidebarContent = () => (
    <Card className="h-fit border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <MessageCircle className="w-5 h-5 mr-2 text-accent" />
          Recent Chats
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search conversations..." className="pl-10 border-0 bg-accent/5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-3">
        {conversationHistory.map((conversation) => (
          <div 
            key={conversation.id}
            className={cn(
              "p-3 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-md",
              "hover:bg-gradient-to-r hover:from-accent/5 hover:to-transparent"
            )}
          >
            <div className="flex items-start space-x-3">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0",
                conversation.type === "ai" 
                  ? "bg-accent/10 text-accent group-hover:bg-accent/20" 
                  : "bg-primary/10 text-primary group-hover:bg-primary/20"
              )}>
                {conversation.type === "ai" ? (
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold truncate group-hover:text-accent transition-colors">{conversation.title}</p>
                  {conversation.unread > 0 && (
                    <Badge variant="default" className="text-xs bg-accent hover:bg-accent/80 h-5 px-2">
                      {conversation.unread}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mb-1">{conversation.lastMessage}</p>
                <p className="text-xs text-muted-foreground">
                  {formatTime(conversation.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="pt-3 mt-4 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full justify-start text-accent hover:bg-accent/10">
            <Archive className="w-4 h-4 mr-2" />
            View All Conversations
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid lg:grid-cols-4 gap-4 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <SidebarContent />
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 col-span-full">
            <Card className="h-[600px] sm:h-[700px] flex flex-col border-0 shadow-lg overflow-hidden">
              <CardHeader className="border-b border-border bg-gradient-to-r from-background to-accent/5 p-3 sm:p-6">
                {/* Mobile Header with Menu */}
                <div className="flex items-center justify-between mb-4 lg:hidden">
                  <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-accent/10">
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <div className="p-4">
                        <SidebarContent />
                      </div>
                    </SheetContent>
                  </Sheet>
                  <h2 className="font-semibold text-lg">Legal Chat</h2>
                  <div className="w-10"></div> {/* Spacer for centering */}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-accent/5 p-1 border-0">
                    <TabsTrigger value="ai" className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-xs sm:text-sm">
                      <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium hidden sm:inline">AI Assistant</span>
                      <span className="font-medium sm:hidden">AI</span>
                      <Badge variant="secondary" className="ml-1 sm:ml-2 bg-accent/20 text-accent text-xs hidden sm:inline">Free</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="lawyer" className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-xs sm:text-sm">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium hidden sm:inline">Live Attorney</span>
                      <span className="font-medium sm:hidden">Attorney</span>
                      <Badge variant="secondary" className="ml-1 sm:ml-2 bg-primary/20 text-primary text-xs hidden sm:inline">Pro</Badge>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                {/* Chat Header */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <div className="relative">
                      <Avatar className="h-8 w-8 sm:h-12 sm:w-12 border-2 border-white shadow-md">
                        <AvatarImage src={activeTab === "ai" ? "/src/assets/legal-services.jpg" : "/src/assets/hero-legal.jpg"} />
                        <AvatarFallback className={activeTab === "ai" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}>
                          {activeTab === "ai" ? <Bot className="w-3 h-3 sm:w-6 sm:h-6" /> : <User className="w-3 h-3 sm:w-6 sm:h-6" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm sm:text-lg truncate">
                        {activeTab === "ai" ? "AI Legal Assistant" : "Sarah Johnson, Esq."}
                      </h3>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {activeTab === "ai" ? "Always available" : "Online now"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {activeTab === "lawyer" && (
                      <>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary p-1 sm:p-2">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary p-1 sm:p-2">
                          <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" className="p-1 sm:p-2">
                      <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-b from-background to-accent/5">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 sm:space-x-3 ${
                      message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                      <AvatarImage src={message.avatar} />
                      <AvatarFallback>
                        {message.sender === "user" ? (
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : message.sender === "ai" ? (
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg ${message.sender === "user" ? "text-right" : ""}`}>
                      <div
                        className={cn(
                          "p-3 sm:p-4 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md",
                          message.sender === "user"
                            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground ml-auto rounded-br-md"
                            : message.sender === "ai"
                            ? "bg-gradient-to-r from-accent/10 to-accent/5 text-accent-foreground border border-accent/20 rounded-bl-md"
                            : "bg-gradient-to-r from-muted to-muted/80 rounded-bl-md border"
                        )}
                      >
                        <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 sm:mt-2 px-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start space-x-2 sm:space-x-3 animate-in fade-in-0 duration-300">
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                      <AvatarImage src={activeTab === "ai" ? "/src/assets/legal-services.jpg" : "/src/assets/hero-legal.jpg"} />
                      <AvatarFallback className={activeTab === "ai" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}>
                        {activeTab === "ai" ? <Bot className="w-3 h-3 sm:w-4 sm:h-4" /> : <User className="w-3 h-3 sm:w-4 sm:h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gradient-to-r from-muted to-muted/80 p-3 sm:p-4 rounded-2xl rounded-bl-md border shadow-sm">
                      <div className="flex space-x-1 items-center">
                        <span className="text-xs text-muted-foreground mr-2">
                          {activeTab === "ai" ? "AI is thinking..." : "Attorney is typing..."}
                        </span>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Message Input */}
              <div className="border-t border-border bg-gradient-to-r from-background to-accent/5 p-3 sm:p-4">
                <div className="flex items-end space-x-2 sm:space-x-3">
                  <Button variant="ghost" size="sm" className="hover:bg-accent/10 hover:text-accent transition-colors p-2 hidden sm:flex">
                    <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Type your ${activeTab === "ai" ? "question" : "message"} here...`}
                      className="min-h-[50px] sm:min-h-[60px] resize-none pr-10 sm:pr-12 border-0 bg-muted/50 focus:bg-background transition-colors rounded-xl text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 hover:bg-accent/10 hover:text-accent p-1 sm:p-2 hidden sm:flex"
                    >
                      <Smile className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-3 sm:px-6 py-2"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2 sm:mt-3 text-xs text-muted-foreground px-1">
                  <span className="flex items-center space-x-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs hidden sm:inline">Enter</kbd>
                    <span className="hidden sm:inline">to send •</span>
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs hidden sm:inline">Shift+Enter</kbd>
                    <span className="hidden sm:inline">for new line</span>
                    <span className="sm:hidden">Tap send to reply</span>
                  </span>
                  {activeTab === "ai" && (
                    <span className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span className="hidden sm:inline">AI responses are for informational purposes only</span>
                      <span className="sm:hidden">AI info only</span>
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="mt-8 sm:mt-12">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold text-primary mb-2 sm:mb-3">Quick Legal Services</h3>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">Access our most popular legal services and tools to get started immediately</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:from-accent/20 group-hover:to-accent/10 transition-colors">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-accent transition-colors">Document Templates</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Access legal document templates and forms</p>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-primary transition-colors">Legal Q&A</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Get answers to common legal questions</p>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:from-accent/20 group-hover:to-accent/10 transition-colors">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-accent transition-colors">Schedule Consultation</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Book time with a licensed attorney</p>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-primary transition-colors">Case Evaluation</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Get your legal case professionally reviewed</p>
              </CardContent>
            </Card>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Chat;