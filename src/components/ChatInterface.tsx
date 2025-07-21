import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbot-messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (error) {
        console.error('Error loading saved messages:', error);
      }
    } else {
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        text: "Hey there! I'm your AI buddy. Ask me anything! I can help you with questions, have conversations, or just chat about whatever's on your mind. 🤖✨",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbot-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scroll to show/hide scroll button
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom && messages.length > 5);
    }
  };

  // Mock AI response function
  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      "That's a really interesting question! Let me think about that for a moment...",
      "I understand what you're asking. Here's what I think about that topic:",
      "Great question! Based on what you've shared, I'd say:",
      "Thanks for sharing that with me. My perspective on this is:",
      "I appreciate you asking! From my understanding:",
      "That's something I find fascinating too. Here's my take:",
      "Absolutely! I've been thinking about similar things lately. I believe:",
      "That reminds me of something important. I think the key point is:",
      "You've touched on something really valuable there. In my view:",
      "I'm glad you brought that up! My thoughts are:"
    ];

    const topics = [
      "Technology is constantly evolving, and it's amazing how it shapes our daily lives.",
      "The human experience is incredibly rich and complex, filled with unique perspectives.",
      "Learning is a lifelong journey that opens up so many possibilities.",
      "Creativity and problem-solving go hand in hand in the most beautiful ways.",
      "Connection and communication are fundamental to who we are as beings.",
      "The world around us is full of patterns and systems worth exploring.",
      "Every question leads to new discoveries and deeper understanding.",
      "Balance and mindfulness can make such a difference in our approach to challenges.",
      "Innovation often comes from asking the right questions at the right time.",
      "There's always more than one way to look at any situation or problem."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    return `${randomResponse} ${randomTopic}`;
  };

  const handleSendMessage = async (messageText: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      text: '',
      isUser: false,
      timestamp: new Date(),
      isTyping: true
    };

    setMessages(prev => [...prev, typingMessage]);

    try {
      // Get AI response
      const aiResponse = await getAIResponse(messageText);
      
      // Remove typing indicator and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          isUser: false,
          timestamp: new Date()
        };
        return [...filtered, botMessage];
      });
    } catch (error) {
      // Remove typing indicator and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== 'typing');
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
          isUser: false,
          timestamp: new Date()
        };
        return [...filtered, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatbot-messages');
    
    // Add welcome message after clearing
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: 'welcome-new',
        text: "Chat cleared! I'm ready for our new conversation. What would you like to talk about?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <ChatHeader 
        onClearChat={handleClearChat}
        messageCount={messages.filter(msg => !msg.isTyping).length}
      />

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 20% 80%, hsl(263 70% 60% / 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(270 100% 80% / 0.1) 0%, transparent 50%)',
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-muted-foreground">
              <p className="text-lg mb-2">Start a conversation</p>
              <p className="text-sm">Type a message below to get started!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
              isTyping={message.isTyping}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="sm"
          className={cn(
            "absolute bottom-20 right-6 h-10 w-10 p-0 rounded-full",
            "bg-primary/80 hover:bg-primary shadow-lg backdrop-blur-sm",
            "transition-all duration-200 hover:scale-110"
          )}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
      />
    </div>
  );
};