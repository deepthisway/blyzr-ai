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
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Start a conversation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ask me anything about your project
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "px-4 transition-all duration-200 ease-in-out",
                    index === messages.length - 1 &&
                      "animate-in slide-in-from-bottom-2"
                  )}
                >
                  <MessageCard
                    content={message.content}
                    role={message.role}
                    fragment={message.fragment}
                    createdAt={message.createdAt}
                    isActiveFragment= {activeFragment?.id === message.fragment?.id}
                    onFragmentClick={() => {setActiveFragment(message.fragment)}}
                    type={message.type}
                  />
                </div>
              ))}
              {isLastMessageUser && <MessageLoading/>}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Message Form */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto">
          <MessageForm projectId={projectId} />
        </div>
      </div>

      {/* Scroll to bottom button (optional) */}
      {messages.length > 5 && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-20 right-6 z-10 rounded-full bg-primary/90 p-2 text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary hover:shadow-xl"
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
