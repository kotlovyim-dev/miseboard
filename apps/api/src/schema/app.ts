import type { Context } from "../context";
import { findAppBySlug, findAppsByIds, listApps } from "../repositories/apps";
import { builder } from "./builder";

export const App = builder.loadableNode("App", {
  id: { resolve: (app) => app.id },
  load: (ids: string[], context: Context) => findAppsByIds(context.db, ids),
  sort: (app) => app.id,
  fields: (t) => ({
    name: t.exposeString("name"),
    slug: t.exposeString("slug"),
    config: t.field({ type: "JSON", resolve: (app) => app.config }),
    isTemplate: t.exposeBoolean("isTemplate"),
    updatedAt: t.field({ type: "DateTime", resolve: (app) => app.updatedAt }),
  }),
});

builder.queryFields((t) => ({
  apps: t.field({
    type: [App],
    resolve: (_root, _args, context) => listApps(context.db),
  }),
  app: t.field({
    type: App,
    nullable: true,
    args: { slug: t.arg.string({ required: true }) },
    resolve: (_root, args, context) => findAppBySlug(context.db, args.slug),
  }),
}));
