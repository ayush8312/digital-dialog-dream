import { useEffect, useState } from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export const ChatMessage = ({ message, isUser, timestamp, isTyping }: ChatMessageProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typing animation for bot messages
  useEffect(() => {
    if (!isUser && !isTyping) {
      if (currentIndex < message.length) {
        const timer = setTimeout(() => {
          setDisplayedText(message.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, 30);
        return () => clearTimeout(timer);
      }
    } else {
      setDisplayedText(message);
    }
  }, [currentIndex, message, isUser, isTyping]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn(
      "flex w-full mb-4 message-slide-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[80%] md:max-w-[70%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "ml-2 chat-bubble-user" : "mr-2 chat-bubble-bot"
        )}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col">
          <div className={cn(
            "px-4 py-3 rounded-2xl relative",
            isUser 
              ? "chat-bubble-user rounded-tr-md" 
              : "chat-bubble-bot rounded-tl-md"
          )}>
            {isTyping ? (
              <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {displayedText}
                {!isUser && currentIndex < message.length && (
                  <span className="typing-animation"></span>
                )}
              </p>
            )}
          </div>
          
          {/* Timestamp */}
          <span className={cn(
            "text-xs text-muted-foreground mt-1 px-1",
            isUser ? "text-right" : "text-left"
          )}>
            {formatTime(timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};