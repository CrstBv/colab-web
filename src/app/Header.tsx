import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
    return <div className="border-b py-3 bg-gray-100 ">
        <div className="items-center container mx-auto justify-between flex">
            <div>
                Colab Web
            </div>
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
}