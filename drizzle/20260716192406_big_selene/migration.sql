CREATE TABLE "foods" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "foods_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"caloriesPerUnit" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meal_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "meal_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"mealId" integer NOT NULL,
	"foodId" integer NOT NULL,
	"quantity" real DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meals" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "meals_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar(255) NOT NULL,
	"name" varchar(255),
	"loggedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "meal_items_meal_id_idx" ON "meal_items" ("mealId");--> statement-breakpoint
CREATE INDEX "meal_items_food_id_idx" ON "meal_items" ("foodId");--> statement-breakpoint
CREATE INDEX "meals_user_id_idx" ON "meals" ("userId");--> statement-breakpoint
ALTER TABLE "meal_items" ADD CONSTRAINT "meal_items_mealId_meals_id_fkey" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meal_items" ADD CONSTRAINT "meal_items_foodId_foods_id_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("id") ON DELETE RESTRICT;