import { useState, useRef, useEffect } from "react";
import { TrendingUp, DollarSign, Target, ArrowDown, Bot } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "./ChatSidebar";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  createdAt: Date;
  messages: Message[];
}

export function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages, isLoading]);

  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
    setShowScrollButton(!isNearBottom);
  };

  useEffect(() => {
    const scrollElement = scrollAreaRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      return () => scrollElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const generateId = () => Math.random().toString(36).substring(7);

  const createNewConversation = () => {
    const newId = generateId();
    const newConversation: Conversation = {
      id: newId,
      title: "Nova Conversa",
      lastMessage: "Conversa iniciada",
      createdAt: new Date(),
      messages: [],
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newId);
    return newId;
  };

  const handleSendMessage = async (content: string) => {
    let conversationId = activeConversationId;

    if (!conversationId) {
      conversationId = createNewConversation();
    }

    const userMessage: Message = {
      id: generateId(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              title:
                conv.messages.length === 0
                  ? content.slice(0, 50) + "..."
                  : conv.title,
              lastMessage: content,
            }
          : conv
      )
    );
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://assistente-ia-curso.onrender.com",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pergunta: content }),
        }
      );

      if (!response.ok) throw new Error("Erro ao se conectar com o servidor");

      const data = await response.json();

      const assistantMessage: Message = {
        id: generateId(),
        content: data.resposta || "Não consegui obter resposta no momento.",
        role: "assistant",
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, assistantMessage],
                lastMessage: assistantMessage.content.slice(0, 50) + "...",
              }
            : conv
        )
      );
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: generateId(),
        content: "⚠️ Erro ao conectar com o servidor. Tente novamente.",
        role: "assistant",
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, errorMessage],
                lastMessage: errorMessage.content,
              }
            : conv
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    if (activeConversationId === id) {
      const remaining = conversations.filter((conv) => conv.id !== id);
      setActiveConversationId(remaining[0]?.id);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full flex bg-chat-background">
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onConversationSelect={handleConversationSelect}
          onNewConversation={createNewConversation}
          onDeleteConversation={handleDeleteConversation}
        />

        <div className="flex-1 flex flex-col relative">
          {/* Header */}
          <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="lg:hidden" />
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold text-foreground">
                    Rico por conta própria
                  </h1>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                <ScrollArea className="flex-1" ref={scrollAreaRef}>
                  <div className="space-y-4 p-4">
                    {activeConversation.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    
                    {/* Indicador de carregamento */}
                    {isLoading && (
                      <div className="flex gap-3 p-4 rounded-xl max-w-4xl mx-auto mr-auto">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-chat-message-assistant text-foreground">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="inline-block p-4 rounded-2xl shadow-sm bg-chat-message-assistant text-foreground border border-border">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <span 
                                    className="w-2 h-2 bg-primary rounded-full animate-bounce" 
                                    style={{ animationDelay: '0ms' }}
                                  ></span>
                                  <span 
                                    className="w-2 h-2 bg-primary rounded-full animate-bounce" 
                                    style={{ animationDelay: '150ms' }}
                                  ></span>
                                  <span 
                                    className="w-2 h-2 bg-primary rounded-full animate-bounce" 
                                    style={{ animationDelay: '300ms' }}
                                  ></span>
                                </div>
                                <span className="text-sm font-medium">
                                  Pensando...
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Aguarde um momento enquanto processo sua pergunta
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Barra fixa */}
                <div className="border-t border-border bg-background p-2 sticky bottom-0">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                  <TrendingUp className="h-16 w-16 mx-auto text-primary mb-6" />
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    Fala investidor! 👋
                  </h2>
                  <h3 className="text-xl text-primary mb-6">
                    Como posso te ajudar a ficar rico?
                  </h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Sou seu assistente especializado em investimentos do curso
                    "Rico por conta própria". Estou aqui para te ajudar com:
                  </p>

                  <div className="grid gap-4 text-left">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                      <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">
                          Estratégias de Investimento
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Ações, fundos, renda fixa e mais
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                      <Target className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">
                          Análise de Mercado
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Tendências e oportunidades
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                      <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-foreground">
                          Planejamento Financeiro
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Metas e objetivos pessoais
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Input inicial para começar conversa */}
                  <div className="mt-8">
                    <ChatInput
                      onSendMessage={handleSendMessage}
                      isLoading={isLoading}
                      placeholder="Qual sua dúvida sobre investimentos?"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botão flutuante de scroll */}
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-20 right-6 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/80 transition"
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
}