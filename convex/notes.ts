import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNote = mutation({
    args: {title: v.string(), body: v.string()},
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            return null
        }

        const user = await ctx.db
         .query("users")
         .withIndex("by_tokenIdentifier", (q) =>
          q.eq("tokenIdentifier", identity.tokenIdentifier)
         )
        .first();

        if(!user) {
            return null
        }

        await ctx.db.insert("notes", {
            title: args.title,
            body: args.body,
            userId: user?._id,
        })
    }
})

export const getLastNotes = query({
    args: {},
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()

        if(!identity) {
            return null
        }
        const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) =>
         q.eq("tokenIdentifier", identity.tokenIdentifier)
        )
       .first();

       if(!user) {
           return null
       }

        const notes = await ctx.db.query("notes").withIndex("by_userId", (q) => q.eq("userId", user._id)).order("desc").take(5)

        return notes
    }
})