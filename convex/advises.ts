import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hasAccessToOrg } from "./users";

export const createAdvise = mutation({
  args: { title: v.string(), body: v.string(), orgId: v.string() },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return null;
    }

    await ctx.db.insert("advises", {
      title: args.title,
      body: args.body,
      orgId: args.orgId,
    });
  },
});

export const getLastAdvises = query({
  args: { orgId: v.string() },
  async handler(ctx, args) {
    const hasAccess = await hasAccessToOrg(ctx, args.orgId);

    if (!hasAccess) {
      return [];
    }

    const advises = await ctx.db
      .query("advises")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .take(5);

      return advises
  }
});
