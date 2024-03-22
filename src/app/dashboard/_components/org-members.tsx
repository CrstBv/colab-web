import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doc } from "../../../../convex/_generated/dataModel";

export function OrgMembers({ member }: { member: Doc<"users"> }) {
  return (
    <div className="flex w-full my-1">
      {member.orgIds[0].role === "admin" ? (
        <div className="flex max-w-[515px] w-full items-center">
          <Avatar className="w-8 h-8">
            <AvatarImage src={member?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-2">
            <div className="flex w-full items-center justify-start">
              {member?.name}
            </div>
            <p className="flex w-full items-center">{member.orgIds[0].role}</p>
          </div>
        </div>
      ) : (
        <div className="flex max-w-[515px] w-full items-center">
          <Avatar className="w-8 h-8">
            <AvatarImage src={member?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-2">
            <div className="flex w-full items-center justify-start">
              {member?.name}
            </div>
            <p className="flex w-full items-center">{member.orgIds[0].role}</p>
          </div>
        </div>
      )}
    </div>
  );
}
