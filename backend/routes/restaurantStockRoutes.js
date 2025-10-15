import express from "express";
import {
  addRestaurantStock,
  getRestaurantStocks,
  deleteRestaurantStock,
  updateUsedToday,
} from "../controllers/restaurantStockController.js";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

router.post("/add", addRestaurantStock);
router.get("/all", getRestaurantStocks);
router.delete("/:id", deleteRestaurantStock);
router.put("/update-used/:id", updateUsedToday);


// routes/restaurantStockRoutes.js
router.get("/low-stocks", async (req, res) => {
  const { data, error } = await supabase
    .from("restaurant_stocks")
    .select("*")
    .lt("remaining_stock", 10); // 👈 threshold

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});


export default router;
