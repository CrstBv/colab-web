"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { GetOrgIdUserId } from "../_components/overview-content";
import { SendButton } from "../_components/send-button";
import { NoteCardActions } from "./note-actions";

export default function NoteCard() {
  const orgId = GetOrgIdUserId();

  const notes = useQuery(api.notes.getAllNotes, orgId ? { orgId } : "skip");

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-xl mb-4 font-semibold">
        Notes are only viewable for you
      </h1>
      <div className="w-full grid grid-cols-3 gap-3 mb-6">
        {notes?.map((note) => (
          <div key={note._id} className="p-1 w-full gap-3">
            <Card className="relative">
              <div className="absolute top-3 right-3">
                <NoteCardActions note={note} />
              </div>
              <CardContent className="flex flex-col h-[230px] items-center justify-center p-1">
                <h1 className="text-lg font-semibold">{note.title}</h1>
                <span className="ml-1">{note.body}</span>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <SendButton title="Create Note" type="Note" />
    </div>
  );
}
