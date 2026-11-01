CREATE TYPE "public"."order_status" AS ENUM('NEW', 'PREPARING', 'READY', 'SERVED', 'CANCELLED');--> statement-breakpoint
CREATE TABLE "apps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"config" jsonb NOT NULL,
	"is_template" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"venue_id" uuid NOT NULL,
	"name" text NOT NULL,
	"unit" text NOT NULL,
	"qty" numeric NOT NULL,
	"min_qty" numeric NOT NULL,
	CONSTRAINT "inventory_items_qty_non_negative" CHECK ("inventory_items"."qty" >= 0)
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"price_kopecks" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"order_id" uuid NOT NULL,
	"menu_item_id" uuid NOT NULL,
	"qty" integer NOT NULL,
	"price_kopecks" integer NOT NULL,
	CONSTRAINT "order_items_order_id_menu_item_id_pk" PRIMARY KEY("order_id","menu_item_id")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"venue_id" uuid NOT NULL,
	"status" "order_status" DEFAULT 'NEW' NOT NULL,
	"total_kopecks" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "apps_slug_idx" ON "apps" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "menu_items_category_idx" ON "menu_items" USING btree ("category");--> statement-breakpoint
CREATE INDEX "orders_venue_created_at_id_idx" ON "orders" USING btree ("venue_id","created_at" DESC NULLS LAST,"id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");