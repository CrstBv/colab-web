"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Placeholder } from "./file-browser";
import { FileCard } from "./file-card";
import { GetOrgIdUserId } from "./overview-content";

export function FilesCollection() {
  const orgId = GetOrgIdUserId();

  const lastFiles = useQuery(
    api.files.getLastFiles,
    orgId ? { orgId } : "skip"
  );

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const modifiedFiles =
    lastFiles?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  return (
    <div className="w-full mt-4">
      <div className="grid grid-cols-4 gap-3">
        {modifiedFiles?.map((file) => {
          return <FileCard key={file._id} file={file} />;
        })}
      </div>
      {lastFiles?.length === 0 && (
        <Placeholder
          message="You have no files, upload one now"
          image="/no_data.svg"
        />
      )}
    </div>
  );
}
