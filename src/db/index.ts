import { defineRelations } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const relations = defineRelations(schema, (r) => ({
    foods: {
        mealItems: r.many.mealItems(),
    },
    meals: {
        items: r.many.mealItems(),
    },
    mealItems: {
        meal: r.one.meals({
            from: r.mealItems.mealId,
            to: r.meals.id,
        }),
        food: r.one.foods({
            from: r.mealItems.foodId,
            to: r.foods.id,
        }),
    },
}));

const db = drizzle(process.env.DATABASE_URL!, { relations });

export { db };