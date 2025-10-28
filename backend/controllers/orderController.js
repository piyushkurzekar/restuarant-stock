import { supabase } from "../config/supabaseClient.js";
import PDFDocument from "pdfkit";

// -------------------- ORDERS --------------------

// Place a new order
export const placeOrder = async (req, res) => {
    try {
        const { guestName, contact, tableNumber, dateTime, items, total } = req.body;

        const { data, error } = await supabase.from("orders").insert([
            { guestName, contact, tableNumber, dateTime, items, total, status: "Pending" },
        ]);

        if (error) throw error;

        res.status(201).json({ message: "Order placed successfully", data });
    } catch (err) {
        console.error("placeOrder error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get pending orders
export const getPendingOrders = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .eq("status", "Pending")
            .order("created_at", { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("getPendingOrders error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get cart orders (Pending + Confirmed)
export const getCartOrders = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .in("status", ["Pending", "Confirmed"])
            .order("created_at", { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("getCartOrders error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Confirm order (send to Kitchen)
export const confirmOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const { data, error } = await supabase
            .from("orders")
            .update({ status: "Confirmed", notes })
            .eq("id", id)
            .select();

        if (error) throw error;
        res.json({ message: "Order sent to Kitchen", data });
    } catch (err) {
        console.error("confirmOrder error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get kitchen orders (Confirmed + Completed)
export const getKitchenOrders = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .in("status", ["Confirmed", "Completed"])
            .order("created_at", { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("getKitchenOrders error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Complete an order
export const completeOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from("orders")
            .update({ status: "Completed" })
            .eq("id", id)
            .select();

        if (error) throw error;
        res.json({ message: "Order completed successfully", data });
    } catch (err) {
        console.error("completeOrder error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get completed orders (optionally filtered by date)
export const getCompletedOrders = async (req, res) => {
    try {
        const { date } = req.query;
        let query = supabase.from("orders").select("*").eq("status", "Completed");
        if (date) query = query.eq("dateTime", date);

        const { data, error } = await query.order("created_at", { ascending: false });
        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error("getCompletedOrders error:", err);
        res.status(500).json({ error: err.message });
    }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error("getOrderById error:", err);
        res.status(404).json({ error: "Order not found" });
    }
};

// -------------------- SEND INVOICE --------------------

export const sendInvoiceToWhatsApp = async (req, res) => {
    const { orderId } = req.params;

    try {
        // 1️⃣ Fetch the order
        const { data: orderData, error: orderError } = await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

        if (orderError || !orderData) {
            console.error("Order fetch error:", orderError);
            return res.status(404).json({ error: "Order not found" });
        }

        // 2️⃣ Parse items safely
        let items = [];
        try {
            items = Array.isArray(orderData.items)
                ? orderData.items
                : JSON.parse(orderData.items || "[]");
        } catch {
            items = [];
        }

        // 3️⃣ Generate PDF
        const pdfBuffer = await new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 40 });
                const buffers = [];

                doc.on("data", buffers.push.bind(buffers));
                doc.on("end", () => resolve(Buffer.concat(buffers)));
                doc.on("error", reject);

                // Header
                doc.fontSize(20).fillColor("green").text("SHIVAAM FARMS & RESORTS", { align: "center" });
                doc.moveDown();
                doc.fontSize(10).fillColor("black");
                doc.text("01, AB, Green Planet, Omkar Nagar", { align: "center" });
                doc.text("📞 +91 7387750307", { align: "center" });
                doc.text("📧 shivaamfarmsandresorts@gmail.com", { align: "center" });
                doc.moveDown();

                doc.fontSize(14).text("INVOICE", { align: "center" });
                doc.moveDown();

                // Order details
                doc.fontSize(10);
                doc.text(`Invoice To: ${orderData.guestName || "N/A"}`);
                doc.text(`Table: ${orderData.tableNumber || "N/A"}`);
                doc.text(`Contact: ${orderData.contact || "N/A"}`);
                doc.text(`Date: ${new Date(orderData.dateTime).toLocaleString()}`);
                doc.moveDown();

                // Items
                let totalAmount = 0;
                items.forEach((item) => {
                    const name = item.name || "Item";
                    const price = Number(item.price) || 0;
                    const quantity = Number(item.quantity) || 1;
                    const subtotal = Number(item.total) || price * quantity;
                    totalAmount += subtotal;
                    doc.text(`${name} - ${price} x ${quantity} = ${subtotal}`);
                });

                doc.moveDown();
                doc.fontSize(12).fillColor("green").text(`Total Amount: ₹ ${totalAmount}`, { align: "right" });
                doc.end();
            } catch (err) {
                reject(err);
            }
        });

        // 4️⃣ Upload PDF to the bucket
        const fileName = `invoice_${orderId}_${Date.now()}.pdf`;
        const { error: uploadError } = await supabase.storage
            .from("invoices")
            .upload(fileName, pdfBuffer, { contentType: "application/pdf", upsert: true });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return res.status(500).json({ error: "Failed to upload invoice" });
        }

        // 5️⃣ Get public URL
        const { data: publicData } = supabase.storage
            .from("invoices")
            .getPublicUrl(fileName);

        console.log("PDF generated and uploaded:", publicData.publicUrl);
        res.json({ message: "Invoice uploaded successfully", publicUrl: publicData.publicUrl });
    } catch (err) {
        console.error("Unexpected error in sendInvoiceToWhatsApp:", err);
        res.status(500).json({ error: "Unexpected server error" });
    }
};