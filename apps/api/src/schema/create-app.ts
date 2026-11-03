import { EMPTY_APP_CONFIG } from "@miseboard/config";
import { findTemplate, insertApp } from "../repositories/apps";
import { slugify } from "../slug";
import { App } from "./app";
import { builder } from "./builder";

builder.mutationFields((t) => ({
  createApp: t.field({
    type: App,
    authScopes: { admin: true },
    args: {
      name: t.arg.string({ required: true, validate: { minLength: 1, maxLength: 80 } }),
      fromTemplate: t.arg.boolean({ defaultValue: false }),
    },
    resolve: async (_root, args, context) => {
      const template = args.fromTemplate ? await findTemplate(context.db) : undefined;
      const config = template?.config ?? EMPTY_APP_CONFIG;
      return insertApp(context.db, args.name, slugify(args.name), config);
    },
  }),
}));
