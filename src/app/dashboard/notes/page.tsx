"use client"
import { useQuery } from "convex/react";
import { SendButton } from "../_components/send-button";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";


export default function NotesPage() {

    const notes = useQuery(api.notes.getLastNotes);

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl mb-4 font-semibold">Notes are only viewable for you</h1>
            <div className="w-full grid grid-cols-3 gap-3 mb-6">
            {notes?.map((note) => (
                <div key={note._id} className="p-1 w-full gap-3">
                  <Card>
                    <CardContent className="flex flex-col h-[230px] items-center justify-center p-1">
                      <h1 className="text-lg font-semibold">{note.title}</h1>
                      <span className="ml-1">{note.body}</span>
                    </CardContent>
                  </Card>
                </div>
            ))}
            </div>
            <SendButton title="Create Note" type="Note"/>
        </div>
        )
}