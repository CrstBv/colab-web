"use client";
import { CreateChatGroup, Message } from "@/app/chat";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { SendMessageForm } from "../_components/send-message-form";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export default function Chat() {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const organization = useOrganization();
  const user = useUser();

  function scrollToBotton() {
    if(chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }


  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const getMessages = useQuery(
    api.messages.getMessages,
    orgId
      ? {
          orgId,
        }
      : "skip"
  );

  useEffect(() => {
    scrollToBotton()
  }, [getMessages])

  return (
    <>
      <div className="flex flex-col w-full items-center">
        <h1 className="flex justify-center font-bold">Org Chat</h1>
        <div ref={chatContainerRef} className="w-[660px] max-h-[600px] h-full overflow-y-scroll">

          {getMessages?.map((message) => {
           
            return <Message key={message._id} message={message} />;
          })}
        </div>
        <SendMessageForm />
      </div>
      <CreateChatGroup />
    </>
  );
}
