// Perfect 👍 — that actually makes it easier!
// Since your table already has remaining_stock, you only need to fix two things:

// Don’t calculate remaining on frontend (quantity - used_today)

// Update remaining_stock in backend whenever used_today changes

// Let’s go step-by-step 👇

// 🧩 Step 1 — Update Your React Code

// 👉 Replace this part inside your table:

// {item.quantity - (item.used_today || 0)}


// with this:

// {item.remaining_stock}


// ✅ This ensures you’re displaying the actual remaining_stock from the database, not a derived value.

// 🧩 Step 2 — Update Your Backend API

// In your backend PUT /update-used/:id route
// (probably in controllers/restaurantStocksController.js),
// update the logic like this 👇

// // ✅ Update "used_today" and "remaining_stock"
// export const updateUsedStock = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { used_today } = req.body;

//     // Fetch current record
//     const { data: stock, error: fetchError } = await supabase
//       .from("restaurant_stocks")
//       .select("quantity, remaining_stock, used_today")
//       .eq("id", id)
//       .single();

//     if (fetchError || !stock) {
//       throw fetchError || new Error("Stock item not found");
//     }

//     // 🧠 Calculate new remaining_stock
//     // (Subtract only the difference between old and new used_today)
//     const usedDifference = used_today - stock.used_today;
//     let newRemaining = stock.remaining_stock - usedDifference;

//     if (newRemaining < 0) newRemaining = 0;

//     // Update in Supabase
//     const { error: updateError } = await supabase
//       .from("restaurant_stocks")
//       .update({
//         used_today,
//         remaining_stock: newRemaining,
//       })
//       .eq("id", id);

//     if (updateError) throw updateError;

//     res.json({ message: "Stock updated successfully" });
//   } catch (err) {
//     console.error("Error updating stock:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

// 🧩 Step 3 — Don’t change anything in your cron job

// Keep your cron as it is:

// await supabase
//   .from("restaurant_stocks")
//   .update({ used_today: 0 })
//   .neq("id", 0);


// ✅ This will reset only used_today,
// and since remaining_stock is handled independently, it won’t refill.

// ✅ Final Behavior
// Action	used_today	remaining_stock	Result
// Increase usage (+)	increases	decreases	✅ correct
// Decrease usage (-)	decreases	increases	✅ correct
// Cron reset	resets to 0	unchanged	✅ correct
// New stock added	handled separately	increases	✅ correct

// Would you like me to modify your backend route file completely (with imports and exports) so you can just copy–paste it?