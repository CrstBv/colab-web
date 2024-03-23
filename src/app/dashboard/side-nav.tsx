"use client";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useQuery } from "convex/react";
import {
  ClipboardListIcon,
  FilesIcon,
  FolderIcon,
  MessageSquareIcon,
  NotebookIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { useGetOrgIdUserId } from "./_components/overview-content";

export function FilesButton() {
  const pathname = usePathname();
  return (
    <div>
      <Link href={"/dashboard/files"}>
        <Button
          variant={"link"}
          className={clsx("gap-2", {
            "text-cyan-800": pathname.includes("/dashboard"),
          })}
        >
          <FolderIcon />
          Your Files
        </Button>
      </Link>
    </div>
  );
}

export function SideNav() {
  const orgId = useGetOrgIdUserId();

  const members = useQuery(api.users.getOrgMembers, orgId ? { orgId } : "skip");
  const pathname = usePathname();
  return (
    <div className="w-40 flex flex-col gap-2">
      <Link href={"/dashboard/overview"}>
        <Button
          variant={"link"}
          className={clsx("gap-2", {
            "text-cyan-500": pathname.includes("/dashboard/overview"),
          })}
        >
          <ClipboardListIcon />
          Overview
        </Button>
      </Link>
      <Link href={"/dashboard/notes"}>
        <Button
          variant={"link"}
          className={clsx("gap-2", {
            "text-cyan-500": pathname.includes("/dashboard/notes"),
          })}
        >
          <NotebookIcon />
          Notes
        </Button>
      </Link>
      {members && members.length > 0 && (
        <Link href={"/dashboard/chat"}>
          <Button
            variant={"link"}
            className={clsx("gap-2", {
              "text-cyan-500": pathname.includes("/dashboard/chat"),
            })}
          >
            <MessageSquareIcon />
            Chat
          </Button>
        </Link>
      )}
      <Link href={"/dashboard/files"}>
        <Button
          variant={"link"}
          className={clsx("gap-2", {
            "text-cyan-500": pathname.includes("/dashboard/files"),
          })}
        >
          <FilesIcon />
          All Files
        </Button>
      </Link>

      <Link href={"/dashboard/favorites"}>
        <Button
          variant={"link"}
          className={clsx("gap-2", {
            "text-cyan-500": pathname.includes("/dashboard/favorites"),
          })}
        >
          <StarIcon />
          Favorites
        </Button>
      </Link>

      <Link href={"/dashboard/trash"}>
        <Button
          variant={"link"}
          className={clsx("gap-2", {
            "text-cyan-500": pathname.includes("/dashboard/trash"),
          })}
        >
          <Trash2Icon />
          Trash
        </Button>
      </Link>
    </div>
  );
}
