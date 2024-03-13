import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {

  return (
    <div className="container mx-auto pt-10">
      <div>Home</div>
      <Link href={"/dashboard/files"}>
        <Button>Files</Button>
      </Link>
    </div>
  );
}
