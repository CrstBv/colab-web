"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Loader2Icon, SendIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../../../convex/_generated/api";
import { GetOrgIdUserId } from "./overview-content";
import { UploadFileMessage } from "./upload-message-file";

const formSchema = z.object({
  body: z.string().min(1).max(200),
});

export function SendMessageForm() {
  const sendMessage = useMutation(api.messages.sendMessage);

  const orgId = GetOrgIdUserId();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) {
      return;
    }

    try {
      await sendMessage({ body: values.body, orgId });
      form.reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-row items-center justify-between gap-1 py-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex justify-between"
          >
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Write a message"
                      className="w-[478px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex gap-1"
              >
              {form.formState.isSubmitting && (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              )}
              <SendIcon className="w-4 h-4" />
            </Button>
          </form>
        </Form>
            <UploadFileMessage />
    </div>
  );
}
