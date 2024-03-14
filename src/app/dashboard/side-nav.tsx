"use client"
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FilesIcon, FolderIcon, FolderOpen, StarIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function FilesButton() {
  const pathname = usePathname()
  return(
    <div>
      <Link href={"/dashboard/files"}>
      <Button variant={"link"} className={clsx("gap-2",  {
        'text-cyan-800' : pathname.includes("/dashboard"),
      })}>
        <FolderIcon />
        Your Files
      </Button>
    </Link>
    </div>
    
  )
}

export function SideNav() {
    const pathname = usePathname()
    return (

        <div className="w-40 flex flex-col gap-2">
    <Link href={"/dashboard/files"}>
      <Button variant={"link"} className={clsx("gap-2",  {
        'text-cyan-500' : pathname.includes("/dashboard/files"),
      })}>
        <FilesIcon />
        All Files
      </Button>
    </Link>

    <Link href={"/dashboard/favorites"}>
      <Button variant={"link"} className={clsx("gap-2",  {
        'text-cyan-500' : pathname.includes("/dashboard/favorites"),
      })}>
        <StarIcon />
        Favorites
      </Button>
    </Link>

    <Link href={"/dashboard/trash"}>
      <Button variant={"link"} className={clsx("gap-2",  {
        'text-cyan-500' : pathname.includes("/dashboard/trash"),
      })}>
        <Trash2Icon />
        Trash
      </Button>
    </Link>
  </div>
        )
}