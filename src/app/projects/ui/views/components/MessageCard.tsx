import React from "react";
import { Card } from "@/components/ui/card";
import { Fragment, MessageRole, MessageType } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ChevronRightIcon,
  Code2Icon,
  Bot,
  User,
  AlertTriangle,
} from "lucide-react";

interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
}

interface UserMessageProps {
  content: string;
  createdAt: Date;
}

interface AssistantProps {
  content: string;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
}

interface FragmentCardProps {
  fragment: Fragment;
  onFragmentClick: (fragment: Fragment) => void;
  isActiveFragment: boolean;
}

const FragmentCard = ({
  fragment,
  onFragmentClick,
  isActiveFragment,
}: FragmentCardProps) => {
  return (
    <div className="mt-3">
      <Card
        className={cn(
          "p-3 cursor-pointer transition-all duration-200 hover:shadow-md border-l-4",
          isActiveFragment
            ? "border-l-primary bg-primary/5 shadow-sm"
            : "border-l-muted hover:border-l-primary/50"
        )}
        onClick={() => onFragmentClick(fragment)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Code2Icon className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground truncate">
                {fragment.title}
              </h4>
              <ChevronRightIcon className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {fragment.sandboxUrl}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const AssistantCard = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: AssistantProps) => {
  return (
    <div className="flex gap-3 mb-6">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            type === "ERROR"
              ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              : "bg-primary/10 text-primary"
          )}
        >
          {type === "ERROR" ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-foreground">Blyzr</span>
          <span className="text-xs text-muted-foreground">
            {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
          </span>
        </div>

        {/* Message Content */}
        <div
          className={cn(
            "prose prose-sm max-w-none",
            type === "ERROR" && "text-red-700 dark:text-red-400"
          )}
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>

        {/* Fragment */}
        {fragment && type === "RESULT" && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
};

const UserMessage = ({ content, createdAt }: UserMessageProps) => {
  return (
    <div className="flex gap-3 mb-6 justify-end">
      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col items-end max-w-2xl">
        {/* Timestamp */}
        <div className="text-xs text-muted-foreground mb-1">
          {format(createdAt, "HH:mm")}
        </div>

        {/* Message Bubble */}
        <Card className="px-4 py-3 bg-primary text-primary-foreground shadow-sm max-w-full">
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </Card>
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      </div>
    </div>
  );
};

const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: MessageCardProps) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantCard
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
      />
    );
  }
  return <UserMessage content={content} createdAt={createdAt} />;
};

export default MessageCard;
