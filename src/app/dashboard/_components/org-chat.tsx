"use client";
import { ChatMessage } from "@/app/dashboard/_components/chat-message";
import { useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { api } from "../../../../convex/_generated/api";
import { OrgMembers } from "../_components/org-members";
import { GetOrgIdUserId } from "../_components/overview-content";
import { SendMessageForm } from "../_components/send-message-form";
import { Button } from "@/components/ui/button";
import { ChevronsRightIcon } from "lucide-react";
import Link from "next/link";
import { CreateOrganization } from "@clerk/nextjs";

export default function OrgChat() {
    const chatContainerRef = useRef<HTMLDivElement>(null);
  
    const orgId = GetOrgIdUserId();
  
    function scrollToBotton() {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }
  
    const members = useQuery(api.users.getOrgMembers, orgId ? { orgId } : "skip");
  
    const getMessages = useQuery(
      api.messages.getMessages,
      orgId
        ? {
            orgId,
          }
        : "skip"
    );
  
    useEffect(() => {
      scrollToBotton();
    }, [getMessages]);
  
    if(members?.length === 0) {
      return <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold">Theres no one to chat with</h1>
        <p>Create a new Organization </p>
        <CreateOrganization />
        <p> or </p>
        <Link href={"/dashboard/notes"}>
        <Button variant={"ghost"}>
          <ChevronsRightIcon /> Go to Notes Page
        </Button>
        </Link>
      </div>
      
    }
  
    return (
      <div className="flex flex-row w-full p-6">
        {members && members.length > 0 && (
          <>
            <div className="flex flex-col max-w-64 w-full pt-2">
              <h1 className="flex justify-center font-bold">Chat Members</h1>
              {members?.map((member) => {
                return <OrgMembers key={member._id} member={member} />;
              })}
            </div>
            <div className="flex flex-col w-full items-center">
              <h1 className="flex justify-center font-bold">
                {members[0].orgIds[0].orgName} {"Chat"}
              </h1>
              <div
                ref={chatContainerRef}
                className="w-[660px] h-[600px] overflow-y-scroll border border-black"
              >
                {getMessages?.map((message) => {
                  return <ChatMessage key={message._id} message={message} />;
                })}
              </div>
              <SendMessageForm />
            </div>
          </>
        )}
      </div>
    );
  }