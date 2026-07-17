import {
    index,
    integer,
    pgTable,
    real,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const foods = pgTable("foods", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    caloriesPerUnit: integer().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
});

export const meals = pgTable("meals", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 255 }),
    loggedAt: timestamp().notNull().defaultNow(),
    createdAt: timestamp().notNull().defaultNow(),
}, (table) => [
    index("meals_user_id_idx").on(table.userId),
]);

export const mealItems = pgTable("meal_items", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    mealId: integer()
        .notNull()
        .references(() => meals.id, { onDelete: "cascade" }),
    foodId: integer()
        .notNull()
        .references(() => foods.id, { onDelete: "restrict" }),
    quantity: real().notNull().default(1),
}, (table) => [
    index("meal_items_meal_id_idx").on(table.mealId),
    index("meal_items_food_id_idx").on(table.foodId),
]);
