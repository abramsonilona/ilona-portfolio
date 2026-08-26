import type { Food } from "./types";

/** Starter foods so the app isn't empty on first use. Calories are
 * approximate, everyday values — the user can edit or add their own. */
export const SEED_FOODS: Omit<Food, "id" | "createdAt">[] = [
  { name: "Egg", caloriesPerServing: 70, servingSize: "1 large" },
  { name: "Cucumber", caloriesPerServing: 16, servingSize: "1 medium", isZeroPointVeggie: true },
  { name: "Tomato", caloriesPerServing: 22, servingSize: "1 medium", isZeroPointVeggie: true },
  { name: "Olive oil", caloriesPerServing: 40, servingSize: "1 tsp" },
  { name: "Olive oil", caloriesPerServing: 120, servingSize: "1 tbsp" },
  { name: "Bread slice", caloriesPerServing: 80, servingSize: "1 slice" },
  { name: "Cottage cheese", caloriesPerServing: 90, servingSize: "100g" },
  { name: "Yogurt", caloriesPerServing: 100, servingSize: "1 cup" },
  { name: "Banana", caloriesPerServing: 105, servingSize: "1 medium" },
  { name: "Bamba", caloriesPerServing: 160, servingSize: "1 bag (25g)" },
  { name: "Chocolate", caloriesPerServing: 150, servingSize: "1 bar (30g)" },
];
