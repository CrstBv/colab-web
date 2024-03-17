"use client";
import { useQuery } from "convex/react";
import { intlFormat } from "date-fns";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function CreateChatGroup() {
  const chatMembers = ["member1", "member2", "member3"];
  return (
    <div>
      <h1>Chat Members</h1>
      <div>
        {/*chat members */}
        <ul>
          {chatMembers?.map((member, index) => {
            return (
              <li key={index}>
                <div>{member}</div>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <p>Add Member to Chat</p>
      </div>
    </div>
  );
}

export function Message({ message }: { message: Doc<"messages"> }) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: message.userId,
  });
  const me = useQuery(api.users.getMe);
  return (
    <div>
      <div key={message._id} className="flex flex-col w-full">
        {message.userId !== me?._id ? (
            <div className="flex max-w-[515px] w-full items-center">
             <Avatar className="w-8 h-8">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-2">
            <div className="flex w-full items-center justify-start text-xs">
              {userProfile?.name} {intlFormat(
                new Date(message._creationTime),
                { hour: "numeric", minute: "numeric" },
                { locale: "en-US" }
              )}
            </div>
            <p className="flex  items-center justify-start mb-2">{message.body}</p>
            </div>
            </div>
        ) : (
          <div className="flex items-center justify-end w-full">
             
          <div className="flex flex-col mr-2 max-w-[515px] w-full">
            <div className="flex w-full items-center justify-end text-xs">
              {userProfile?.name} {intlFormat(
                new Date(message._creationTime),
                { hour: "numeric", minute: "numeric" },
                { locale: "en-US" }
              )}
            </div>
            <p className="flex items-center justify-end mb-2">{message.body}</p>
          </div>
          <Avatar className="w-8 h-8 justify-end">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          </div>
        )}
      </div>
    </div>
  );
}
