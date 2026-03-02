"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Paperclip,
  Mic,
  MoreVertical,
  Phone,
  Video,
  Share2,
  CornerDownLeft,
} from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { useGemini } from "@/lib/gemini";

// Types
type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
};

export default function ChatInterface() {
  const { getGeminiResponse } = useGemini();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content:
        "Good morning, Dr. Sarah. I'm your MediAI assistant. How can I help you with your clinical tasks today?",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const aiContent = await getGeminiResponse(currentInput);

      let finalContent = aiContent;
      if (aiContent === "API_KEY_MISSING") {
        finalContent =
          "### 🔑 API Key Required\n\nPlease set your Gemini API Key to enable AI responses. You can do this by clicking the **Settings** icon in the sidebar or adding `NEXT_PUBLIC_GEMINI_API_KEY` to your environment.";
      } else if (aiContent === "API_KEY_INVALID") {
        finalContent =
          "### ❌ Invalid API Key\n\nThe provided Gemini API Key appears to be invalid or has expired. Please check your settings and ensure you have a valid key from Google AI Studio.";
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: finalContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-1 flex-col h-full bg-slate-50/50">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Bot size={18} />
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"></span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">MediBot AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-xs text-slate-500">Online</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <Phone size={18} />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <Video size={18} />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <Share2 size={18} />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth"
        ref={scrollRef}
      >
        {/* Date separator */}
        <div className="flex justify-center">
          <span className="text-xs font-medium text-slate-400 bg-white/50 px-3 py-1 rounded-full border border-slate-200/60 backdrop-blur-sm">
            Today, {new Date().toLocaleDateString()}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={clsx(
                "flex w-full",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={clsx(
                  "flex max-w-[85%] md:max-w-[75%] gap-3",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                {/* Avatar */}
                <div
                  className={clsx(
                    "shrink-0 self-end mb-1",
                    msg.role === "user" ? "h-8 w-8" : "h-8 w-8 md:h-9 md:w-9",
                  )}
                >
                  {msg.role === "user" ? (
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                      className="h-full w-full rounded-full bg-slate-100 border border-slate-200"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                      <Bot size={14} />
                    </div>
                  )}
                </div>

                {/* Bubble */}
                <div className="flex flex-col gap-1">
                  <div
                    className={clsx(
                      "relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                      msg.role === "user"
                        ? "bg-slate-900 text-white rounded-tr-sm"
                        : "bg-white text-slate-800 border border-slate-200/60 rounded-tl-sm prose prose-slate prose-sm max-w-none",
                    )}
                  >
                    {msg.role === "ai" ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <span className="text-[10px] font-medium px-1">
                    {mounted
                      ? new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start w-full"
          >
            <div className="flex max-w-[85%] md:max-w-[75%] gap-3">
              <div className="shrink-0 self-end mb-1 h-8 w-8 md:h-9 md:w-9">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                  <Bot size={14} />
                </div>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1 h-[46px]">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 pt-0">
        <div className="relative flex items-end gap-3 rounded-2xl bg-white border border-slate-200/80 p-2 shadow-lg shadow-slate-200/50 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-300 transition-all">
          <div className="flex flex-col gap-1">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-blue-500 transition">
              <Paperclip size={18} />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about patient care..."
            className="flex-1 resize-none bg-transparent py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none max-h-32"
            rows={1}
          />

          <div className="flex flex-col gap-1">
            <button className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
              <Mic size={18} />
            </button>
          </div>

          <button
            onClick={handleSend}
            className={clsx(
              "flex h-11 w-11 items-center justify-center rounded-xl transition-all active:scale-95",
              input.trim() && !isTyping
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/30"
                : "bg-slate-100 text-slate-400 cursor-not-allowed",
            )}
            disabled={!input.trim() || isTyping}
          >
            <Send size={18} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-[10px] text-slate-400">
            AI-powered clinical assistant. Verify all medical advice.
          </span>
        </div>
      </div>
    </div>
  );
}
