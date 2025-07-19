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
    onSuccess: (data)=> {
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
      form.reset(); 
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
          "relative border p-4 pt-1 rounded-t-3xl bg-sidebar transition-shadow",
          isFocused && "shadow-xs",
          showUsage && "rounded-t-none"
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextareaAutosize
                  {...field}
                  disabled={isPending}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="What would you like to build?"
                  onKeyDown={handleKeyDown}
                  className="w-full resize-none border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  minRows={1}
                  maxRows={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>
            </kbd>
            <span>+</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              Enter
            </kbd>
            <span>to submit</span>
          </div>

          <Button
            type="submit"
            disabled={isDisabled}
            size="sm"
            className={cn(
              "size-8 rounded-full p-0 transition-all",
              !isDisabled && "hover:bg-primary/90"
            )}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MessageForm;
