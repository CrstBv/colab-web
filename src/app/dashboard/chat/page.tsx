"use client";
import { ChatMessage } from "@/app/dashboard/_components/chat-message";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useEffect, useRef } from "react";
import { api } from "../../../../convex/_generated/api";
import { SendMessageForm } from "../_components/send-message-form";
import { OrgMembers } from "../_components/org-members";
import { useGetOrgIdUserId } from "../_components/overview-content";

export default function Chat() {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const orgId = useGetOrgIdUserId()


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

  return (
    <div className="flex flex-row w-full p-6">
      {members && members.length > 0 ? (
        <>
          <div className="flex flex-col max-w-64 w-full pt-2">
            <h1 className="flex justify-center font-bold">Chat Members</h1>
            {members?.map((member) => {
              return <OrgMembers key={member._id} member={member} />;
            })}
          </div>
          <div className="flex flex-col w-full items-center">
            <h1 className="flex justify-center font-bold">{members[0].orgIds[0].orgName} {"Chat"}</h1>
            <div
              ref={chatContainerRef}
              className="w-[660px] h-[600px] overflow-y-scroll"
            >
              {getMessages?.map((message) => {
                return <ChatMessage key={message._id} message={message} />;
              })}
            </div>
            <SendMessageForm />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col w-full items-center">
            <h1 className="flex justify-center font-bold">Notes</h1>
            { /*change for notes*/}
            <div
              ref={chatContainerRef}
              className="w-[660px] h-[600px] overflow-y-scroll"
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
