
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useGetOrgIdUserId } from "./overview-content";

export function DataCarousel() {
  const orgId = useGetOrgIdUserId();

  const members = useQuery(api.users.getOrgMembers, orgId ? { orgId } : "skip");

  const advises = useQuery(
    api.advises.getLastAdvises,
    orgId ? { orgId } : "skip"
  );

  const notes = useQuery(api.notes.getLastNotes);

  return (
    <>
      {members && members.length > 0 ? (
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {advises?.map((advise) => (
              <CarouselItem key={advise._id} className="w-full">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col h-[230px] items-center justify-center p-1">
                      <h1 className="text-lg font-semibold">{advise.title}</h1>
                      <span className="ml-1">{advise.body}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full max-w-sm"
        >
          <CarouselContent>
            {notes?.map((note) => (
              <CarouselItem key={note._id} className="w-full">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col h-[230px] items-center justify-center p-1">
                      <h1 className="text-lg font-semibold">{note.title}</h1>
                      <span className="ml-1">{note.body}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </>
  );
}
