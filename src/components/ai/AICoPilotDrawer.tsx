import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, Lightbulb, MessageSquare } from 'lucide-react';
import { FullEventPlan, ChatMessage } from '../../types';
import { executeAITool } from '../../services/aiService';

interface AICoPilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plan: FullEventPlan;
  onUpdatePlan: (updatedPlan: FullEventPlan) => void;
}

export const AICoPilotDrawer: React.FC<AICoPilotDrawerProps> = ({
  isOpen,
  onClose,
  plan,
  onUpdatePlan
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, plan.chatHistory]);

  if (!isOpen) return null;

  const quickPrompts = [
    'How can I lower my venue & catering costs?',
    'Suggest 3 non-cheesy icebreakers',
    'Draft a vendor negotiation email',
    'Review my timeline for bottlenecks'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString()
    };

    const newHistory = [...plan.chatHistory, userMessage];
    onUpdatePlan({ ...plan, chatHistory: newHistory });
    setInput('');
    setIsTyping(true);

    try {
      const res = await executeAITool({
        toolId: 'co_pilot_chat',
        plan,
        customPrompt: text.trim()
      });

      const assistantMessage: ChatMessage = {
        id: `msg-assistant-${Date.now()}`,
        sender: 'assistant',
        content: res.content,
        timestamp: new Date().toISOString()
      };

      onUpdatePlan({
        ...plan,
        chatHistory: [...newHistory, assistantMessage]
      });
    } catch (err) {
      console.error('Co-pilot response error', err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl border-l border-stone-200 dark:border-stone-800 flex flex-col animate-slide-left" role="dialog" aria-modal="true" aria-labelledby="co-pilot-title">
      
      {/* Header */}
      <div className="p-4 px-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-850/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-rose-500 text-white rounded-xl shadow-sm shadow-rose-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 id="co-pilot-title" className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Soirée AI Co-Pilot
            </h3>
            <p className="text-[11px] text-stone-500">
              Live context: {plan.details.title} ({plan.details.guestCount} guests)
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close co-pilot drawer"
          className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {plan.chatHistory.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                isUser ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[85%] leading-relaxed ${
                isUser
                  ? 'bg-rose-600 text-white rounded-tr-none'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-none whitespace-pre-line'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-stone-400 pl-9">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-500" />
            <span>Soirée is reasoning...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            aria-label={`Quick prompt: ${prompt}`}
            className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 whitespace-nowrap transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            id="co-pilot-input"
            placeholder="Ask anything about your event..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Ask Soirée AI Co-Pilot a question"
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="p-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
