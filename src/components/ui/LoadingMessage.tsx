import { Bot } from "lucide-react";

export function LoadingMessage() {
  return (
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
  );
}