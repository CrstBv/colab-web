import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNote = mutation({
  args: { title: v.string(), body: v.string(), orgId: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) {
      return null;
    }

    await ctx.db.insert("notes", {
      title: args.title,
      body: args.body,
      userId: user?._id,
      orgId: args.orgId,
    });
  },
});

export const getLastNotes = query({
  args: {orgId: v.string()},
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) {
      return null;
    }

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .order("desc")
      .take(7);

    return notes;
  },
});

export const getAllNotes = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();

    if (!user) {
      return null;
    }

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .order("desc")
      .collect();

    return notes;
  },
});

export const updateNote = mutation({
  args: {
    noteId: v.id("notes"),
    title: v.optional(v.string()),
    body: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const note = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("_id"), args.noteId))
      .first();

    if (!note) {
      throw new ConvexError("You don't have access to this note");
    }

    await ctx.db.patch(args.noteId, {
      title: args.title,
      body: args.body,
    });
  },
});

export const deleteNote = mutation({
  args: { noteId: v.id("notes") },
  async handler(ctx, args) {
    const note = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("_id"), args.noteId))
      .first();

    if (!note) {
      throw new ConvexError("You can't delete this note");
    }

    await ctx.db.delete(args.noteId);
  },
});
