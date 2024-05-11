import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { FilesButton } from "./dashboard/side-nav";

export function Header() {
  return (
    <div className="relative z-10 border-b py-3 bg-gray-100">
      <div className="flex items-center container mx-auto justify-between">
        <Link href={"/"} className="flex gap-2 items-center text-lg">
          <Image
            src={"/logo.svg"}
            width={"72"}
            height={"72"}
            alt="colab web logo"
          />
          Colab Web
        </Link>
        <SignedIn>
          <FilesButton />
        </SignedIn>

        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton afterSignOutUrl="/" />
          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
