import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hasAccessToOrg } from "./users";
import { fileTypes } from "./schema";

export const getMessages = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);
    if (!hasAccess) {
      return [];
    }
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .collect();
    return messages.reverse();
  },
});

export const sendMessage = mutation({
  args: { body: v.string(), orgId: v.string()},
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      throw new ConvexError("you do not have access to this org");
    }

    await ctx.db.insert("messages", {
      body: args.body,
      orgId: args.orgId,
      userId: hasAccess.user._id,
    });
  },
});

export const sendFile = mutation({
  args: { body: v.string(), orgId: v.string(), fileId: v.id("_storage"), type: fileTypes },
  async handler(ctx, args){
    const hasAccess = await hasAccessToOrg(ctx, args.orgId)

    if(!hasAccess) {
      throw new ConvexError("you do not have access to this org");
    }

    await ctx.db.insert("messages", {
      body: args.body,
      orgId: args.orgId,
      userId: hasAccess.user._id,
      fileId: args.fileId,
      type: args.type
    })

  }
})
