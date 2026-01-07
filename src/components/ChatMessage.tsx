import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  
  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-xl max-w-4xl mx-auto",
      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser 
          ? "bg-chat-message-user text-primary-foreground" 
          : "bg-chat-message-assistant text-foreground"
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      
      <div className={cn(
        "flex-1 min-w-0",
        isUser ? "text-right" : "text-left"
      )}>
        <div className={cn(
          "inline-block p-4 rounded-2xl max-w-full shadow-sm",
          isUser 
            ? "bg-chat-message-user text-primary-foreground ml-auto" 
            : "bg-chat-message-assistant text-foreground mr-auto border border-border"
        )}>
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="markdown-wrapper text-sm leading-relaxed">
              <ReactMarkdown
                components={{
                  h1: ({children}) => (
                    <h1 className="text-xl font-bold mb-3 mt-4 text-foreground">
                      {children}
                    </h1>
                  ),
                  h2: ({children}) => (
                    <h2 className="text-lg font-bold mb-2 mt-3 text-foreground">
                      {children}
                    </h2>
                  ),
                  h3: ({children}) => (
                    <h3 className="text-base font-semibold mb-2 mt-2 text-foreground">
                      {children}
                    </h3>
                  ),
                  p: ({children}) => (
                    <p className="mb-3 text-foreground leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({children}) => (
                    <ul className="list-disc ml-6 mb-3 space-y-1 text-foreground">
                      {children}
                    </ul>
                  ),
                  ol: ({children}) => (
                    <ol className="list-decimal ml-6 mb-3 space-y-1 text-foreground">
                      {children}
                    </ol>
                  ),
                  li: ({children}) => (
                    <li className="text-foreground">
                      {children}
                    </li>
                  ),
                  strong: ({children}) => (
                    <strong className="font-bold text-primary">
                      {children}
                    </strong>
                  ),
                  em: ({children}) => (
                    <em className="italic text-foreground">
                      {children}
                    </em>
                  ),
                  code: ({children}) => (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                      {children}
                    </code>
                  ),
                  pre: ({children}) => (
                    <pre className="bg-muted p-3 rounded-lg overflow-x-auto mb-3">
                      {children}
                    </pre>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        
        <p className={cn(
          "text-xs text-muted-foreground mt-2 px-1",
          isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
}