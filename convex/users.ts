import { ConvexError, v } from "convex/values";
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  query
} from "./_generated/server";
import { roles } from "./schema";

export async function getUser(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first();

  if (!user) {
    throw new ConvexError("expected user to be defined");
  }
  return user;
}

export const createUser = internalMutation({
  args: { tokenIdentifier: v.string(), name: v.string(), image: v.string() },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgIds: [],
      name: args.name,
      image: args.image,
    });
  },
});
export const updateUser = internalMutation({
  args: { tokenIdentifier: v.string(), name: v.string(), image: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db.query("users").withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier)).first()
    
    if(!user) {
      throw new ConvexError("no user with this token found")
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      image: args.image,
    });
  },
});

export const addOrgIdToUser = internalMutation({
  args: { tokenIdentifier: v.string(),orgName: v.string(), orgId: v.string(), role: roles },
  handler: async (ctx, args) => {
    const user = await getUser(ctx, args.tokenIdentifier);

    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, { orgName: args.orgName, orgId: args.orgId, role: args.role }],
    });
  },
});

export const updateRoleInOrgForUser = internalMutation({
  args: { tokenIdentifier: v.string(), orgId: v.string(), role: roles },
  handler: async (ctx, args) => {
    const user = await getUser(ctx, args.tokenIdentifier);

    const org = user.orgIds.find((org) => org.orgId === args.orgId)

    if(!org) {
      throw new ConvexError("expected an org on the user but was not found when updated")
    }

    org.role = args.role

    await ctx.db.patch(user._id, {
      orgIds: user.orgIds
    });
  },
});

export async function hasAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  orgId: string
) {
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

  const hasAccess =
    user.orgIds.some((item) => item.orgId === orgId) ||
    user.tokenIdentifier.includes(orgId);

  if (!hasAccess) {
    return null;
  }

  return { user };
}

export const getUserProfile = query({
  args: { userId: v.id("users")},
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId)

    return{
      name: user?.name,
      image: user?.image
    }
  }
})

export const getMe = query({
  args: {},
    async handler(ctx) {
      const identity = await ctx.auth.getUserIdentity()

      if(!identity) {
        return null
      }

      const user = await getUser(ctx, identity.tokenIdentifier)

      if(!user) {
        return null
      }

      return user
  }
})

export const getOrgMembers = query({
  args: { orgId: v.string()},
  async handler(ctx, args) {
    const orgId = args.orgId;

    if (!orgId) {
      throw new ConvexError("orgId expected");
    }

    const user = await hasAccessToOrg(ctx, args.orgId)
    if(!user) {
      return null
    }

    const orgName = user.user.orgIds[0].orgName

    const orgMembers = await ctx.db
      .query("users")
      .filter((q) => q.or(q.eq(q.field("orgIds"), [{orgId, orgName , role: "admin"}]),q.eq(q.field("orgIds"), [{orgId, orgName, role: "member"}])))
      .collect();
    if (!orgMembers) {
      return [];
    }

    return orgMembers;
  },
});
