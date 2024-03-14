import Link from "next/link";

export function Footer() {
    return (
        <div className="h-44 bg-slate-100 mt-14 flex items-center">
            <div className="container mx-auto flex justify-between">
                
            <div>ColabWeb</div>

            <Link href="/privacy">Privacy Police</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/about">About</Link>
            </div>
        </div>
    )
}