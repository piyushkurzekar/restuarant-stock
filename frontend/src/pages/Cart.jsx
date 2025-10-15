// import React from "react";
// import { useOrders } from "../context/OrdersContext";
// import { useNavigate } from "react-router-dom";

// const Cart = () => {
//   const { cart, setCart, confirmOrder } = useOrders();
//   const navigate = useNavigate();

//   // Complete Order: remove table and go to invoice
//   const handleCompleteOrder = (tableKey) => {
//     const tableOrder = cart[tableKey];
//     if (!tableOrder) return;

//     const updatedCart = { ...cart };
//     delete updatedCart[tableKey];
//     setCart(updatedCart);

//     navigate("/invoice", { state: { tableOrder } });
//   };

//   // Add More: navigate back to Orders page with prefilled data
//   const handleAddMore = (tableOrder) => {
//     navigate("/orders", { state: { addMoreFor: tableOrder } });
//   };

//   // Confirm Order: mark as confirmed and redirect to Kitchen
//   const handleConfirmOrder = (tableKey) => {
//     const tableOrder = cart[tableKey];
//     if (!tableOrder) return;

//     // Mark as confirmed in context
//     confirmOrder(tableKey, tableOrder);

//     // Redirect to Kitchen page
//     navigate("/kitchen");
//   };

//   const tableTotal = (items) =>
//     items.reduce((sum, item) => sum + (item.total || item.price * (item.quantity || 1)), 0);

//   return (
//     <div className="container my-4 w-50">
//       <h2>Cart</h2>
//       {Object.keys(cart).length === 0 ? (
//         <p>Your cart is empty</p>
//       ) : (
//         Object.entries(cart).map(([tableKey, order]) => (
//           <div key={tableKey} className="card shadow p-3 mb-4">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <h5>
//                 Guest: {order.guestName} | Table: {order.tableNumber}
//               </h5>
//               <span>Total: {tableTotal(order.items)} ₹</span>
//             </div>

//             <ul>
//               {order.items.map((item, idx) => (
//                 <li key={idx}>
//                   {item.name} x {item.quantity || 1} - ₹{item.total || item.price * (item.quantity || 1)}
//                 </li>
//               ))}
//             </ul>

//             <div className="mt-2 d-flex gap-2">
//               {/* Confirm Order */}
//               <button
//                 className="btn btn-primary"
//                 onClick={() => handleConfirmOrder(tableKey)}
//               >
//                 Confirm Order
//               </button>

//               {/* Add More */}
//               <button
//                 className="btn btn-warning"
//                 onClick={() => handleAddMore(order)}
//               >
//                 Add More
//               </button>

//               {/* Complete Order */}
//               <button
//                 className="btn btn-success"
//                 onClick={() => handleCompleteOrder(tableKey)}
//               >
//                 Complete Order
//               </button>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default Cart;
import React, { useState } from "react";
import { useOrders } from "../context/OrdersContext";
import { useNavigate } from "react-router-dom";

// Predefined extras with fixed prices
const extrasList = [
  { text: "Extra Cheese", price: 50 },
  { text: "Extra Salt", price: 10 },
  { text: "Extra Butter", price: 30 },
  { text: "Extra Onion", price: 20 },
  { text: "Extra Roti", price: 25 },
];

const Cart = () => {
  const { cart, confirmOrder, removeFromCart } = useOrders();
  const navigate = useNavigate();

  // Notes array with text and qty
  const [notes, setNotes] = useState([{ text: "", qty: 1 }]);

  const tableTotal = (items, notes) => {
    const itemsTotal = items.reduce(
      (sum, item) => sum + (item.total || item.price * (item.quantity || 1)),
      0
    );
    const notesTotal = notes.reduce((sum, note) => {
      const extra = extrasList.find((e) => e.text === note.text);
      return sum + (extra ? extra.price * note.qty : 0);
    }, 0);
    return itemsTotal + notesTotal;
  };

  const handleNoteChange = (index, field, value) => {
    setNotes((prev) => {
      const updated = [...prev];
      updated[index][field] = field === "qty" ? parseInt(value, 10) || 1 : value;
      return updated;
    });
  };

  const handleAddNote = () => setNotes((prev) => [...prev, { text: "", qty: 1 }]);
  const handleRemoveNote = (index) => setNotes((prev) => prev.filter((_, i) => i !== index));

  const handleCompleteOrder = (tableKey) => {
    const tableOrder = cart[tableKey];
    if (!tableOrder) return;
    const orderWithNotes = { ...tableOrder, notes };
    removeFromCart(tableOrder.tableNumber, tableOrder.date);
    navigate("/invoice", { state: { tableOrder: orderWithNotes } });
  };

  const handleAddMore = (tableOrder) => navigate("/takeorders", { state: { addMoreFor: tableOrder } });

  const handleConfirmOrder = (tableKey) => {
    const tableOrder = cart[tableKey];
    if (!tableOrder) return;
    const orderWithNotes = { ...tableOrder, notes };
    confirmOrder(tableOrder.tableNumber, orderWithNotes);
    navigate("/kitchen", { state: { tableOrder: orderWithNotes } });
  };

  return (
    <>
      <div className="container my-4 w-50 ms-0">
        <h2>Cart</h2>
        {Object.keys(cart).length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          Object.entries(cart).map(([tableKey, order]) => (
            <div key={tableKey} className="card shadow p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>
                  Guest: {order.guestName} | Table: {order.tableNumber} | Date: {order.date}
                </h5>
                <span>Total: {tableTotal(order.items, notes)} ₹</span>
              </div>

              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x {item.quantity || 1} - ₹
                    {item.total || item.price * (item.quantity || 1)}
                  </li>
                ))}

                {/* Display notes in cart */}
                {notes.map((note, idx) => {
                  if (!note.text) return null;
                  const extra = extrasList.find((e) => e.text === note.text);
                  return (
                    <li key={`note-${idx}`} style={{ color: "blue" }}>
                      {note.text} x {note.qty} - ₹ {extra ? extra.price * note.qty : 0}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-2">
                <button
                  className="btn btn-primary"
                  style={{ marginLeft: "650px", marginTop: "-170px", width: "200px" }}
                  onClick={() => handleConfirmOrder(tableKey)}
                >
                  Confirm Order
                </button>
                <br />
                <button
                  className="btn btn-warning"
                  style={{ marginLeft: "650px", marginTop: "-100px", width: "200px" }}
                  onClick={() => handleAddMore(order)}
                >
                  Add More
                </button>
                <br />
                <button
                  className="btn btn-success"
                  style={{ marginLeft: "650px", marginTop: "-30px", width: "200px" }}
                  onClick={() => handleCompleteOrder(tableKey)}
                >
                  Complete Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notes Section */}
      <div className="container my-4 w-50 ms-0">
        <div className="card shadow p-3">
          <h5 className="card-title">Add Special Notes (Optional)</h5>

          {notes.map((note, index) => (
            <div key={index} className="d-flex align-items-center mb-2 gap-2">
              <select
                className="form-control"
                value={note.text}
                onChange={(e) => handleNoteChange(index, "text", e.target.value)}
              >
                <option value="">Select Extra</option>
                {extrasList.map((extra, idx) => (
                  <option key={idx} value={extra.text}>
                    {extra.text} (₹{extra.price})
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="form-control"
                placeholder="Qty"
                style={{ width: "80px" }}
                min="1"
                value={note.qty}
                onChange={(e) => handleNoteChange(index, "qty", e.target.value)}
              />
              <button className="btn btn-danger" onClick={() => handleRemoveNote(index)}>
                ✕
              </button>
            </div>
          ))}

          <button className="btn btn-outline-primary mt-2" onClick={handleAddNote}>
            + Add Extra
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
