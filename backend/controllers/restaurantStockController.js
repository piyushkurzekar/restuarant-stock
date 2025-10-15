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
export const updateUsedToday = async (req, res) => {
  try {
    const { id } = req.params;
    const { used_today} = req.body;

    const { error } = await supabase
      .from("restaurant_stocks")
      .update({ used_today })
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Stock updated successfully" });


  } catch (err) {
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


