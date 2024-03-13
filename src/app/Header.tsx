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

export function Header() {
  return (
    <div className="border-b py-3 bg-gray-100 ">
      <div className="items-center container mx-auto justify-between flex">
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
            <Button className="" variant={"ghost"}>
                <Link href={"/dashboard/files"}>
                Your Files
            </Link>
            </Button>
            
        </SignedIn>
        
        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
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
