import express from "express";
import cors from "cors";
import cron from "node-cron";
import restaurantStockRoutes from "./routes/restaurantStockRoutes.js";
import { supabase } from "./supabaseClient.js";

const app = express();

app.use(cors());
app.use(express.json());



app.use("/api/restaurant-stocks", restaurantStockRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Restaurant Stock Management API is running...");
});

// 🕛 Reset used_today every midnight
// cron.schedule("0 0 * * *", async () => {
//   try {
//     console.log("🔄 Resetting daily used stock values...");
//     const { error } = await supabase
//       .from("restaurant_stocks")
//       .update({ used_today: 0 })
//       .neq("id", 0); // ✅ ensures Supabase allows update for all rows

//     if (error) throw error;
//     console.log("✅ All used_today values reset to 0 successfully");
//   } catch (err) {
//     console.error("❌ Error resetting used_today:", err.message);
//   }
// });


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});




