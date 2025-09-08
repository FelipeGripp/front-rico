import { useState, useRef, useEffect } from "react";
import { TrendingUp, DollarSign, Target } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  }, [activeConversation?.messages]);

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
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) {
      createNewConversation();
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    // Adiciona a mensagem do usuário
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversationId
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
      // Faz chamada para o backend Flask
      const response = await fetch("https://assistente-ia-curso.onrender.com/responder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pergunta: content }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: generateId(),
        content: data.resposta || "Não consegui gerar uma resposta no momento.",
        role: "assistant",
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: [...conv.messages, assistantMessage],
                lastMessage:
                  assistantMessage.content.slice(0, 50) + "...",
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Erro ao chamar backend:", error);
      const errorMessage: Message = {
        id: generateId(),
        content: "❌ Erro ao conectar com o servidor. Verifique o backend.",
        role: "assistant",
        timestamp: new Date(),
      };
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId
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

        <div className="flex-1 flex flex-col">
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
                <ScrollArea className="flex-1">
                  <div className="space-y-4 p-4">
                    {activeConversation.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
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
        </div>
      </div>
    </SidebarProvider>
  );
}
