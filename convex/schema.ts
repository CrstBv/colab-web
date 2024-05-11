import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileTypes = v.union(v.literal("image"), v.literal("csv"), v.literal("pdf"), v.literal("txt"))

export const roles = v.union(v.literal("admin"), v.literal("member"));

export default defineSchema({
  files: defineTable({
    name: v.string(),
    type: fileTypes,
    orgId: v.string(),
    fileId: v.id("_storage"),
    userId: v.id("users"),
    shouldDelete: v.optional(v.boolean()),
  })
    .index("by_orgId", ["orgId"])
    .index("by_shouldDelete", ["shouldDelete"]),
  favorites: defineTable({
    fileId: v.id("files"),
    orgId: v.string(),
    userId: v.id("users"),
  }).index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    orgIds: v.array(v.object({
      orgName: v.optional(v.string()),
      orgId: v.string(),
      role: v.optional(roles),
    }))
  }).index("by_tokenIdentifier", ["tokenIdentifier"])
  .index("by_orgIds", ["orgIds"]),
  messages: defineTable({
    body: v.string(),
    orgId: v.string(),
    userId: v.id("users"),
    fileId: v.optional(v.id("_storage")),
    type: v.optional(fileTypes)
  }).index("by_orgId", ["orgId"]),
  advises: defineTable({
    title: v.string(),
    body: v.string(),
    orgId: v.string(),
  }).index("by_orgId", ["orgId"]),
  notes: defineTable({
    title: v.string(),
    body: v.string(),
    userId: v.id("users"),
    orgId: v.string(),
  }).index("by_orgId", ["orgId"]),
});

