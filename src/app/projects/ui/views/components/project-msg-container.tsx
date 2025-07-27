import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import MessageCard from "./MessageCard";
import MessageForm from "./message-form";
import { cn } from "@/lib/utils";
import { Fragment } from "@/generated/prisma";
import MessageLoading from "./MessageLoading";

interface MessageContainerProps {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

const MessageContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: MessageContainerProps) => {
  const trpc = useTRPC();
  const messagesEndRef = useRef<HTMLDivElement>(null); // tp scroll to bottom each time chat loads
  const lastAssistantMsgIdRef = useRef<string | null>(null);
  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMessages.queryOptions({
      projectId,
    },{
      refetchInterval: 5000
    })
  );
  useEffect(()=>  {
    const lastAssistantMsg = messages.findLast(
      (message)=> {
        return message.role === "ASSISTANT"
      }
    )
    if(lastAssistantMsg?.fragment && lastAssistantMsg.id !== lastAssistantMsgIdRef.current)  {
      lastAssistantMsgIdRef.current = lastAssistantMsg.id;
      setActiveFragment(lastAssistantMsg.fragment)
      // this will help in not setting the same fragment again and again
      // How this works?
      // 1. We are storing the last assistant message id in the ref
      // 2. When the last assistant message id changes, we set the active fragment
      // 3. If the last assistant message id is same, we do not set the active fragment 
    }
  }, [messages, setActiveFragment])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const lastMessage = messages[messages.length-1];
  const isLastMessageUser = lastMessage?.role === "USER";


  return (
    <div className="flex flex-col h-full bg-background/50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <div className="max-w-full">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[500px] p-8">
              <div className="text-center space-y-6 max-w-md">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/30 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary/20 rounded-full animate-pulse delay-1000"></div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    Welcome to your project!
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Start building something amazing. Describe what you&apos; d like to create and I&apos;ll help you build it step by step.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      Web Apps
                    </span>
                    <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      Components
                    </span>
                    <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">
                      APIs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "px-6 transition-all duration-300 ease-in-out",
                    index === messages.length - 1 &&
                      "animate-in slide-in-from-bottom-3 duration-500"
                  )}
                >
                  <MessageCard
                    content={message.content}
                    role={message.role}
                    fragment={message.fragment}
                    createdAt={message.createdAt}
                    isActiveFragment={activeFragment?.id === message.fragment?.id}
                    onFragmentClick={() => {setActiveFragment(message.fragment)}}
                    type={message.type}
                  />
                </div>
              ))}
              {isLastMessageUser && (
                <div className="px-6">
                  <MessageLoading />
                </div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Message Form */}
      <div className="border-t border-border/50 bg-card/30 backdrop-blur-md supports-[backdrop-filter]:bg-card/20">
        <div className="p-4">
          <MessageForm projectId={projectId} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {messages.length > 3 && (
        <button
          onClick={scrollToBottom}
          className={cn(
            "fixed bottom-24 right-6 z-20 rounded-full p-3 shadow-lg transition-all duration-300",
            "bg-primary/90 hover:bg-primary text-primary-foreground",
            "hover:scale-110 hover:shadow-xl",
            "backdrop-blur-sm border border-primary/20"
          )}
          aria-label="Scroll to bottom"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MessageContainer;
