import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  projectId: string;
}
const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Message is required" })
    .max(10000, { message: "Message must be less than 10000 characters" }),
});

const MessageForm = ({ projectId }: Props) => {
  const queryClient = useQueryClient();
  const showUsage = false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  const trpc = useTRPC();
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: ()=> {
      form.reset();
      queryClient.invalidateQueries(
        // Tells React Query to refetch the messages for the current project to get the fresh conversation
        trpc.messages.getMessages.queryOptions({ projectId })
      );
    },
    onError: (error) => {
      // Handle the error here
      console.error("Message creation failed:", error);
    },
  }));
  const [isFocused, setIsFocused] = useState(false);

  const isPending = createMessage.isPending;
  const isDisabled =
    isPending || !form.formState.isValid || !form.getValues().value.trim();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessage.mutateAsync({
        value: values.value.trim(),
        projectId,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (!isDisabled) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border border-border/50 p-4 bg-card/50 backdrop-blur-sm transition-all duration-200",
          isFocused && "border-primary/50 shadow-lg shadow-primary/5",
          showUsage && "rounded-t-none",
          "rounded-lg"
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <TextareaAutosize
                    {...field}
                    disabled={isPending}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="What would you like to build today?"
                    onKeyDown={handleKeyDown}
                    className={cn(
                      "w-full resize-none border-0 bg-transparent py-3 pr-12 text-sm placeholder:text-muted-foreground/70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                      "leading-relaxed"
                    )}
                    minRows={1}
                    maxRows={8}
                  />
                  
                  {/* Send Button - Positioned absolutely */}
                  <div className="absolute bottom-2 right-2">
                    <Button
                      type="submit"
                      disabled={isDisabled}
                      size="sm"
                      className={cn(
                        "size-8 rounded-full p-0 transition-all duration-200",
                        isDisabled 
                          ? "bg-muted text-muted-foreground cursor-not-allowed" 
                          : "bg-primary hover:bg-primary/90 hover:scale-105 shadow-sm"
                      )}
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-xs mt-1" />
            </FormItem>
          )}
        />

        {/* Footer with keyboard shortcut */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
            <div className="flex items-center gap-1">
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] font-medium">
                <span className="text-xs">⌘</span>
              </kbd>
              <span className="text-muted-foreground/60">+</span>
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] font-medium">
                Enter
              </kbd>
            </div>
            <span className="text-muted-foreground/60">to send</span>
          </div>
          
          {/* Character count (optional) */}
          <div className="text-xs text-muted-foreground/60">
            {form.watch('value')?.length || 0}/10000
          </div>
        </div>
      </form>
    </Form>
  );
};

export default MessageForm;
