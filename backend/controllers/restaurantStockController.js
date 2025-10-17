import { supabase } from "../supabaseClient.js";

// ➕ Add new restaurant stock item
export const addRestaurantStock = async (req, res) => {
  try {
    const {
      item_name,
      category,
      unit,
      quantity,
      price_per_unit,
      used_today,
      received_by,
      supplier_name,
      payment_mode,
      date,
    } = req.body;

    // Validation
    if (!item_name || !category || !unit || !quantity || !price_per_unit || !received_by) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    // Insert data into Supabase
    const { data, error } = await supabase.from("restaurant_stocks").insert([
      {
        item_name,
        category,
        unit,
        quantity,
        price_per_unit,
        used_today: used_today || 0,
        received_by,
        supplier_name,
        payment_mode,
        date: date || new Date().toISOString().split("T")[0],
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "Stock item added successfully", data });
  } catch (error) {
    console.error("Error adding restaurant stock:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📋 Get all restaurant stocks
export const getRestaurantStocks = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("restaurant_stocks")
      .select("*")
      .order("date", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: error.message });
  }
};



// Update used_today for an item
// ✅ Update "used_today" and "remaining_stock"
export const updateUsedStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { used_today } = req.body;

    // Fetch current record
    const { data: stock, error: fetchError } = await supabase
      .from("restaurant_stocks")
      .select("quantity, remaining_stock, used_today")
      .eq("id", id)
      .single();

    if (fetchError || !stock) {
      throw fetchError || new Error("Stock item not found");
    }

    // 🧠 Calculate new remaining_stock
    // (Subtract only the difference between old and new used_today)
    const usedDifference = used_today - stock.used_today;
    let newRemaining = stock.remaining_stock - usedDifference;

    if (newRemaining < 0) newRemaining = 0;

    // Update in Supabase
    const { error: updateError } = await supabase
      .from("restaurant_stocks")
      .update({
        used_today,
        remaining_stock: newRemaining,
      })
      .eq("id", id);

    if (updateError) throw updateError;

    res.json({ message: "Stock updated successfully" });
  } catch (err) {
    console.error("Error updating stock:", err.message);
    res.status(500).json({ error: err.message });
  }
};




// ❌ Delete a stock item
export const deleteRestaurantStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from("restaurant_stocks")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Stock item deleted successfully" });
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).json({ error: error.message });
  }
};


