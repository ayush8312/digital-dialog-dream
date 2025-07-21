import { Bot, MoreVertical, RefreshCw, Trash2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatHeaderProps {
  onClearChat: () => void;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
  messageCount: number;
}

export const ChatHeader = ({ 
  onClearChat, 
  onToggleTheme, 
  isDarkMode = true, 
  messageCount 
}: ChatHeaderProps) => {
  return (
    <div className="glass-effect border-b border-border p-4 rounded-t-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary/30">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold gradient-text">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Always here to help • {messageCount} messages
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onClearChat} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Chat
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onToggleTheme && (
              <DropdownMenuItem onClick={onToggleTheme}>
                <Palette className="mr-2 h-4 w-4" />
                {isDarkMode ? 'Light' : 'Dark'} Theme
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};