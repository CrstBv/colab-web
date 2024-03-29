"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { z } from "zod";

import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GetOrgIdUserId } from "./overview-content";

const formSchema = z.object({
  title: z.string().min(1, "Title most have at least 1 character").max(150),
  body: z.string().max(200),
});

export function SendButton({
  title,
  type,
}: {
  title: string;
  type: "Advise" | "Note";
}) {
  const { toast } = useToast();

  const orgId = GetOrgIdUserId();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return;

    if (type === "Advise") {
      try {
        await createAdvise({ title: values.title, body: values.body, orgId });
        form.reset();

        setIsDialogOpen(false);

        toast({
          variant: "success",
          title: "Advise created",
          description: "Now everyone can view your advise",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Your advise could not be created, try again later",
        });
      }
    }

    if (type === "Note") {
      try {
        await createNote({ title: values.title, body: values.body, orgId });
        form.reset();

        setIsDialogOpen(false);

        toast({
          variant: "success",
          title: "Note created",
          description: "Now you can view your note",
        });
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Your note could not be created, try again later",
        });
      }
    }
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createAdvise = useMutation(api.advises.createAdvise);

  const createNote = useMutation(api.notes.createNote);

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(isOpen) => {
        setIsDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>{title}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3">Create your {type} here</DialogTitle>
          {type === "Advise" ? (
            <DialogDescription>
              This advise will be shown to anyone in your organization
            </DialogDescription>
          ) : (
            <DialogDescription>
              This note will be available only for you
            </DialogDescription>
          )}
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
