"use client";
import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { FilesCollection } from "./file-collection";
import { OrgMembers } from "./org-members";
import Link from "next/link";
import { FilesIcon } from "lucide-react";
import { SendButton } from "./send-button";
import { CarouselSize } from "./over-carousel";

export default function OverviewContent() {
  const orgId = useGetOrgIdUserId();

  const members = useQuery(api.users.getOrgMembers, orgId ? { orgId } : "skip");


  return (
    <div>
      {members && members.length > 0 ? (
        <> 
        <h1 className="text-3xl font-bold">{members[0].orgIds[0].orgName}</h1>
          <div className="w-full h-80 mt-3 flex justify-between">
            <div className="flex flex-col items-center w-full">
              <h2>Last Advises </h2>
              
              <CarouselSize />
              <SendButton title="Send Advise" type="Advise"/>
            </div>
            <div className="flex flex-col min-w-[270px]">
              <h1 className="flex justify-center font-semibold">
                Organization Members
              </h1>

              {members?.map((member) => {
                return <OrgMembers key={member._id} member={member} />;
              })}
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <h2 className="flex justify-center text-xl font-semibold ml-4">
              Last Files Uploaded
            </h2>
            <div className="flex items-center mr-4">
              <Link href={"/dashboard/files"}>
                <Button variant={"secondary"} size={"sm"} className="gap-2">
                <FilesIcon className="w-4 h-4" />All Files</Button>
              </Link>
            </div>
          </div>
          <FilesCollection />
        </>
      ) : (
        <>
          <div className="w-full h-80 mt-6">
            <div className="flex flex-col justify-center items-center">
              <h2>Your last Notes</h2>
              <CarouselSize />
              <SendButton title="Create Note" type="Note"/>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <h2 className="flex justify-center text-xl font-semibold ml-4">
              Last Files Uploaded
            </h2>
            <div className="flex items-center mr-4">
              <Link href={"/dashboard/files"}>
                <Button variant={"secondary"} size={"sm"} className="gap-2">
                <FilesIcon className="w-4 h-4" />All Files</Button>
              </Link>
            </div>
          </div>
          <FilesCollection />
        </>
      )}
    </div>
  );
}

export function useGetOrgIdUserId() {
  const organization = useOrganization();
  const user = useUser();
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  return orgId;
}
