"use client";
import { Doc } from "../../../../convex/_generated/dataModel";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/components/ui/use-toast";
import { Protect } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { EditIcon, MoreVertical, Trash2Icon } from "lucide-react";
import { useState } from "react";

import { api } from "../../../../convex/_generated/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const formSchema = z.object({
  title: z.string().min(1, "Title most have at least 1 character").max(150),
  body: z.string().max(200),
});

export function NoteCardActions({ note }: { note: Doc<"notes"> }) {
  const deleteNote = useMutation(api.notes.deleteNote);
  const me = useQuery(api.users.getMe);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: note.title,
      body: note.body,
    },
  });

  const noteId = note._id;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateNote({
        title: values.title,
        body: values.body,
        noteId,
      });
      form.reset();

      setIsEditDialogOpen(false);

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

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const updateNote = useMutation(api.notes.updateNote);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the note permanently
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteNote({ noteId: note._id });
                toast({
                  variant: "default",
                  title: "Note deleted",
                  description: "The note has been deleted successfully",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(isOpen) => {
          setIsEditDialogOpen(isOpen);
          form.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-3">Edit your Note here</DialogTitle>
            <DialogDescription>This note will be updated</DialogDescription>
          </DialogHeader>

          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                <div className="flex flex-row items-center justify-end gap-2">
                  <Button
                    type="button"
                    className="text-black border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="flex gap-1"
                  >
                    {form.formState.isSubmitting && (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    )}
                    Update
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setIsEditDialogOpen(true);
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <EditIcon className="w-4 h-4" /> Edit
          </DropdownMenuItem>
          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || note.userId === me?._id
              );
            }}
            fallback={<></>}
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setIsConfirmOpen(true);
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                <Trash2Icon className="w-4 h-4" /> Delete
              </div>
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
